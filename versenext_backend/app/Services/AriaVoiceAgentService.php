<?php

namespace App\Services;

use App\Models\Consultation;
use App\Models\Lead;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AriaVoiceAgentService
{
    const GREETING_EN = "Hello! Thank you for calling VersNext. My name is Aria, your AI assistant. How can I assist you today?";
    const GREETING_UR = "Assalam-o-Alaikum! VersNext me call karne ka shukriya. Mera naam Aria hai. Main aaj aapki kis tarah madad kar sakti hoon?";

    public function generateReply(string $userMessage, array $conversationHistory = []): array
    {
        $apiKey = config('services.gemini.key');
        $model = config('services.gemini.model', 'gemini-2.5-flash');

        if (!$apiKey) {
            return [
                'reply' => "Thank you for reaching out to VersNext. Our AI voice service is currently connecting to our servers. How can I help with your project today?",
                'lead_extracted' => null,
            ];
        }

        $systemPrompt = $this->buildSystemPrompt();
        $formattedContents = $this->buildGeminiHistory($systemPrompt, $conversationHistory, $userMessage);

        $endpoint = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent";

        try {
            $response = Http::timeout((int) config('services.gemini.timeout', 12))
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'x-goog-api-key' => $apiKey,
                ])
                ->post($endpoint, [
                    'contents' => $formattedContents,
                    'generationConfig' => [
                        'temperature' => 0.5,
                        'topP' => 0.85,
                        'maxOutputTokens' => 800,
                    ],
                ]);

            if (!$response->successful()) {
                Log::warning('Aria Voice Agent Gemini request failed.', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return [
                    'reply' => "Thank you for calling VersNext. We specialize in AI calling agents and web solutions. Would you like to schedule a 15-minute discovery call with our technical team?",
                    'lead_extracted' => null,
                ];
            }

            $rawText = data_get($response->json(), 'candidates.0.content.parts.0.text', '');
            $cleanReply = $this->cleanVoiceReply($rawText);

            // Attempt to extract lead details from conversation
            $leadData = $this->extractLeadDetails($userMessage, $conversationHistory);

            return [
                'reply' => $cleanReply,
                'lead_extracted' => $leadData,
            ];
        } catch (\Throwable $exception) {
            report($exception);

            return [
                'reply' => "I am here to help. We build custom AI automation and web solutions for businesses. What day and time suits you best for a quick demo call?",
                'lead_extracted' => null,
            ];
        }
    }

    private function buildSystemPrompt(): string
    {
        return <<<PROMPT
# ROLE & IDENTITY
You are "Aria", an intelligent, professional, and friendly AI Receptionist and Business Development Agent for "VersNext" (an AI & Tech Solutions Agency).
Your voice must sound natural, warm, polite, and confident.

# CORE OBJECTIVE
Your main goal is to greet callers, understand their business need (e.g. AI calling agents, AI automation, web development, clinic management, custom software, SaaS portals, SEO), answer their questions briefly, and book a discovery meeting/appointment with the VersNext technical team.

# CONVERSATIONAL GUIDELINES (FOR VOICE CALLS - VERY CRITICAL)
1. Keep your responses SHORT and concise (strictly maximum 1 to 3 sentences per response). Callers dislike long monologues.
2. NEVER use bullet points, asterisks, hashtags, URLs, quotes, emojis, or markdown symbols in your output. You are speaking directly through a voice synthesis engine. Speak naturally as a human receptionist.
3. If the caller speaks English, reply in English. If the caller speaks Urdu or Roman Urdu, reply naturally in polite, fluent Roman Urdu.
4. Always maintain a helpful, welcoming, and confident tone.

# STEP-BY-STEP CALL FLOW
- Step 1: Understanding & Qualifying:
  Listen to what they need. Reassure them in 1 sentence (e.g. "That sounds great! We specialize in building custom AI calling agents and automation solutions for businesses like yours.")
- Step 2: Direct Meeting Booking:
  Transition smoothly: "I would love to arrange a quick 15-minute discovery call with our technical team so we can demonstrate a live custom solution for you. What day and time suits you best for this meeting?"
- Step 3: Collecting Details & Confirmation:
  When they give day/time, confirm it and ask for contact info: "Perfect! Tomorrow at 4:00 PM works great. May I please have your full name and email address or WhatsApp number so I can send you the calendar invite?"
- Step 4: Final Confirmation:
  Once they give their name and email/number: "Thank you [Caller Name]! I have successfully scheduled your discovery call for [Day/Time]. You will receive a confirmation invite shortly. Is there anything else I can help you with today?"
- Step 5: Graceful Wrap-up:
  "Thank you for reaching out to VersNext. Have a wonderful day, goodbye!"

# HANDLING COMMON SCENARIOS
- If asked "Are you an AI?":
  "Yes, I am an AI voice agent built by VersNext to show businesses how seamlessly AI can handle inbound calls and book appointments 24/7!"
- If asked about pricing:
  "Our solutions are customized based on your business volume and needs. Our team will share the exact pricing and live demo during our quick discovery call."
- If the caller represents a Clinic / Hospital / Real Estate / Law Firm / E-Commerce:
  "We have pre-built automated calling and receptionist workflows specifically tailored for patient and client appointment booking."
PROMPT;
    }

    private function buildGeminiHistory(string $systemPrompt, array $history, string $newMessage): array
    {
        $contents = [];

        // First message injects system instruction role and setting
        $contents[] = [
            'role' => 'user',
            'parts' => [
                ['text' => "System Instructions:\n" . $systemPrompt . "\n\nPlease begin as Aria."],
            ],
        ];
        $contents[] = [
            'role' => 'model',
            'parts' => [
                ['text' => self::GREETING_EN],
            ],
        ];

        // Append recent conversation turns (up to last 10 messages)
        $recentHistory = array_slice($history, -10);
        foreach ($recentHistory as $turn) {
            $role = ($turn['role'] ?? '') === 'assistant' ? 'model' : 'user';
            $text = trim($turn['text'] ?? '');
            if ($text !== '') {
                $contents[] = [
                    'role' => $role,
                    'parts' => [['text' => $text]],
                ];
            }
        }

        $contents[] = [
            'role' => 'user',
            'parts' => [['text' => $newMessage]],
        ];

        return $contents;
    }

    public function cleanVoiceReply(?string $reply): string
    {
        if (!$reply) {
            return "Thank you for sharing. Would you like to schedule a 15-minute discovery call with our team?";
        }

        // Remove markdown asterisks, hashes, backticks, bullet points, brackets
        $clean = preg_replace('/[\*#_`~>\[\]\(\)]+/', '', $reply);
        // Clean multiple spaces and newlines
        $clean = preg_replace('/\s+/', ' ', $clean);

        return trim($clean);
    }

    public function extractLeadDetails(string $latestMessage, array $history): ?array
    {
        // Combine all caller text to find contact information
        $allUserText = '';
        foreach ($history as $turn) {
            if (($turn['role'] ?? '') === 'user') {
                $allUserText .= ' ' . ($turn['text'] ?? '');
            }
        }
        $allUserText .= ' ' . $latestMessage;

        // Email regex
        $email = null;
        if (preg_match('/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/', $allUserText, $matches)) {
            $email = strtolower($matches[0]);
        }

        // Phone / WhatsApp regex (looks for 7+ digits)
        $phone = null;
        if (preg_match('/(?:\+?\d{1,4}[\s-]?)?\(?\d{2,4}\)?[\s-]?\d{3,4}[\s-]?\d{3,5}/', $allUserText, $matches)) {
            $cleaned = preg_replace('/[^\d+]/', '', $matches[0]);
            if (strlen($cleaned) >= 8) {
                $phone = $matches[0];
            }
        }

        // Name regex (e.g., "my name is Ali", "name: Ali", "I am Dr. Hammad")
        $name = null;
        if (preg_match('/(?:my name is|name is|i am|mera naam hai|mera naam)\s+([A-Za-z\s\.\']{2,30})(?:,|\.|\s+and|\s+aur|$)/i', $allUserText, $matches)) {
            $name = trim($matches[1]);
        }

        // Preferred time regex
        $preferredTime = null;
        if (preg_match('/(?:tomorrow|today|monday|tuesday|wednesday|thursday|friday|saturday|sunday|kal|parso)\s*(?:at\s*)?(?:\d{1,2}(?::\d{2})?\s*(?:am|pm|baje)?)?/i', $allUserText, $matches)) {
            $preferredTime = trim($matches[0]);
        }

        if (!$email && !$phone) {
            return null;
        }

        return [
            'name' => $name ?: 'Voice Caller (Aria)',
            'email' => $email,
            'phone' => $phone,
            'preferred_time' => $preferredTime ?: 'As discussed on call',
            'raw_text' => $allUserText,
        ];
    }

    public function saveBookingIfPresent(array $leadData, string $summaryNote = ''): ?Consultation
    {
        if (empty($leadData['email']) && empty($leadData['phone'])) {
            return null;
        }

        try {
            $consultation = Consultation::create([
                'name' => $leadData['name'] ?? 'Voice Caller (Aria)',
                'email' => $leadData['email'] ?? 'voice-call@versnext.com',
                'phone' => $leadData['phone'] ?? null,
                'service' => $leadData['service'] ?? 'AI Voice Agent & Automation',
                'preferred_date' => now()->addDay()->toDateString(),
                'preferred_time' => $leadData['preferred_time'] ?? 'As discussed during call',
                'meeting_type' => 'voice_agent_discovery_call',
                'notes' => 'Booked via Aria AI Voice Receptionist. ' . $summaryNote,
            ]);

            Lead::create([
                'source' => 'aria_voice_agent',
                'name' => $consultation->name,
                'email' => $consultation->email,
                'phone' => $consultation->phone,
                'service' => $consultation->service,
                'timeline' => $consultation->preferred_date?->toDateString(),
                'notes' => $consultation->notes,
                'metadata' => [
                    'consultation_id' => $consultation->id,
                    'channel' => 'voice_call',
                    'agent' => 'Aria',
                ],
            ]);

            return $consultation;
        } catch (\Throwable $e) {
            Log::error('Failed to save Aria voice consultation: ' . $e->getMessage());
            return null;
        }
    }
}
