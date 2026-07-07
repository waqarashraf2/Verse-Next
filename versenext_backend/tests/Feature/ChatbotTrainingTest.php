<?php

use App\Models\ChatbotTrainingExample;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('chatbot saves question and answer for future trained replies', function () {
    $payload = [
        'session_id' => 'test-session-001',
        'message' => 'Do you build SEO ready websites?',
        'context' => ['source' => 'test'],
    ];

    $firstResponse = $this->postJson('/api/chatbot/respond', $payload);

    $firstResponse
        ->assertOk()
        ->assertJsonPath('status', true);

    $example = ChatbotTrainingExample::where('normalized_question', 'do you build seo ready websites')->first();

    expect($example)->not->toBeNull()
        ->and($example->answer)->toBe($firstResponse->json('data.reply'));

    $example->update([
        'answer' => 'Yes. Verse Next builds SEO-ready websites with clean structure, metadata, content planning, fast loading, schema, internal linking, and conversion-focused sections.',
        'source' => 'manual_test',
    ]);

    $secondResponse = $this->postJson('/api/chatbot/respond', [
        'session_id' => 'test-session-002',
        'message' => 'Do you build SEO ready websites?',
        'context' => ['source' => 'test'],
    ]);

    $secondResponse
        ->assertOk()
        ->assertJsonPath('data.reply', $example->fresh()->answer)
        ->assertJsonPath('data.reply_source', 'trained_db');
});
