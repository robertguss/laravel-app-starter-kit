<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Mail\Mailable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification as NotificationFacade;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Tests\TestCase;

class OperationalFoundationTest extends TestCase
{
    use RefreshDatabase;

    public function test_database_cache_session_and_queue_drivers_work(): void
    {
        config([
            'cache.default' => 'database',
            'queue.default' => 'database',
            'session.driver' => 'database',
        ]);

        Cache::put('operations-cache', 'available', 60);

        $session = $this->app->make('session')->driver();
        $session->start();
        $session->put('operations-session', 'available');
        $session->save();

        Queue::connection('database')->push(new RecordOperationalMarker);

        $this->assertSame('available', Cache::get('operations-cache'));
        $this->assertDatabaseHas('sessions', ['id' => $session->getId()]);
        $this->assertDatabaseCount('jobs', 1);

        Artisan::call('queue:work', [
            'connection' => 'database',
            '--once' => true,
            '--tries' => 1,
        ]);

        $this->assertDatabaseCount('jobs', 0);
        $this->assertSame('processed', Cache::get('operations-queue'));
    }

    public function test_database_queue_records_failed_jobs(): void
    {
        Queue::connection('database')->push(new FailOperationalJob);

        Artisan::call('queue:work', [
            'connection' => 'database',
            '--once' => true,
            '--tries' => 1,
        ]);

        $this->assertDatabaseCount('jobs', 0);
        $this->assertDatabaseCount('failed_jobs', 1);
    }

    public function test_framework_integrations_work_without_external_providers(): void
    {
        Http::preventStrayRequests();
        Http::fake([
            'https://example.test/status' => Http::response(['status' => 'ok']),
        ]);
        Mail::fake();
        NotificationFacade::fake();
        Storage::fake('local');
        Log::spy();

        $response = Http::get('https://example.test/status');
        Mail::to('operations@example.test')->send(new OperationalMail);
        User::factory()->create()->notify(new OperationalNotification);
        Storage::disk('local')->put('operations/health.txt', 'available');
        Log::info('Operational log smoke test');

        $this->assertSame('ok', $response->throw()->json('status'));

        Http::assertSentCount(1);
        Mail::assertSentCount(1);
        NotificationFacade::assertSentToTimes(User::query()->firstOrFail(), OperationalNotification::class, 1);
        Storage::disk('local')->assertExists('operations/health.txt');
        Log::shouldHaveReceived('info')->once()->with('Operational log smoke test');
    }
}

final class OperationalMail extends Mailable
{
    public function build(): static
    {
        return $this->subject('Operational smoke test')->html('Operational mail smoke test');
    }
}

final class RecordOperationalMarker implements ShouldQueue
{
    use Queueable;

    public function handle(): void
    {
        Cache::store('database')->put('operations-queue', 'processed', 60);
    }
}

final class FailOperationalJob implements ShouldQueue
{
    use Queueable;

    public function handle(): never
    {
        throw new RuntimeException('Expected operational queue failure.');
    }
}

final class OperationalNotification extends Notification
{
    /** @return array<int, string> */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)->line('Operational notification smoke test.');
    }
}
