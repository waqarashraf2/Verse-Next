<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatConversation;
use App\Models\ChatMessage;
use App\Services\AriaVoiceAgentService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class VoiceAgentController extends Controller
{
    protected AriaVoiceAgentService $voiceService;

    public function __construct(AriaVoiceAgentService $voiceService)
    {
        $this->voiceService = $voiceService;
    }

    public function start(Request $request)
    {
        $sessionId = $request->input('session_id') ?: (string) Str::uuid();
        $language = $request->input('language', 'en');

        $greeting = ($language === 'ur') 
            ? AriaVoiceAgentService::GREETING_UR 
            : AriaVoiceAgentService::GREETING_EN;

        $conversation = ChatConversation::firstOrCreate(
            ['session_id' => $sessionId],
            ['status' => 'open', 'metadata' => ['source' => 'aria_voice_call', 'agent' => 'Aria']]
        );

        ChatMessage::create([
            'chat_conversation_id' => $conversation->id,
            'sender' => 'aria_voice_agent',
            'message' => $greeting,
            'metadata' => ['role' => 'assistant', 'type' => 'call_greeting'],
        ]);

        $audioUrl = $this->voiceService->generateHumanAudio($greeting);

        return response()->json([
            'status' => true,
            'data' => [
                'session_id' => $sessionId,
                'agent_name' => AriaVoiceAgentService::AGENT_NAME,
                'greeting' => $greeting,
                'audio_url' => $audioUrl,
                'role' => 'AI Consultant & Business Development',
            ],
        ]);
    }

    public function respond(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:1500',
            'session_id' => 'nullable|string|max:120',
            'history' => 'nullable|array',
        ]);

        $sessionId = $validated['session_id'] ?? (string) Str::uuid();
        $history = $validated['history'] ?? [];

        $conversation = ChatConversation::firstOrCreate(
            ['session_id' => $sessionId],
            ['status' => 'open', 'metadata' => ['source' => 'aria_voice_call', 'agent' => 'Aria']]
        );

        // Record User spoken message
        ChatMessage::create([
            'chat_conversation_id' => $conversation->id,
            'sender' => 'caller',
            'message' => $validated['message'],
            'metadata' => ['type' => 'caller_speech'],
        ]);

        // Generate Aria's spoken response
        $result = $this->voiceService->generateReply($validated['message'], $history);
        $spokenReply = $result['reply'];
        $audioUrl = $result['audio_url'] ?? null;
        $leadExtracted = $result['lead_extracted'];
        $bookingCreated = null;

        if ($leadExtracted) {
            $bookingCreated = $this->voiceService->saveBookingIfPresent(
                $leadExtracted, 
                "Spoken message: " . $validated['message']
            );
        }

        // Record Aria's spoken response
        ChatMessage::create([
            'chat_conversation_id' => $conversation->id,
            'sender' => 'aria_voice_agent',
            'message' => $spokenReply,
            'metadata' => [
                'type' => 'assistant_speech',
                'booking_created' => (bool) $bookingCreated,
            ],
        ]);

        return response()->json([
            'status' => true,
            'data' => [
                'session_id' => $sessionId,
                'reply' => $spokenReply,
                'audio_url' => $audioUrl,
                'booking_confirmed' => (bool) $bookingCreated,
                'booking_id' => $bookingCreated?->id,
            ],
        ]);
    }
}
