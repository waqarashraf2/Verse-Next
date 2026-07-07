<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatConversation;
use App\Models\ChatMessage;
use App\Models\ChatbotTrainingExample;
use App\Models\KnowledgeBaseEntry;
use App\Models\SiteSetting;
use App\Services\GeminiChatService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class ChatbotController extends Controller
{
    public function respond(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:2000',
            'session_id' => 'nullable|string|max:120',
            'context' => 'nullable|array',
        ]);

        $conversation = ChatConversation::firstOrCreate(
            ['session_id' => $validated['session_id'] ?? (string) Str::uuid()],
            ['status' => 'open', 'metadata' => ['source' => 'floating_widget']]
        );

        ChatMessage::create([
            'chat_conversation_id' => $conversation->id,
            'sender' => 'visitor',
            'message' => $validated['message'],
            'metadata' => ['context' => $validated['context'] ?? []],
        ]);

        $message = Str::lower($validated['message']);
        $intent = $this->detectIntent($message);
        $adminOnline = $this->adminOnline();
        $recommendation = $this->recommendationFor($intent, $message);
        $replySource = 'local';
        $learnedAnswer = $this->learnedAnswerFor($validated['message'], $intent);

        if ($learnedAnswer) {
            $recommendation['reply'] = $learnedAnswer->answer;
            $recommendation['service'] = $learnedAnswer->service ?: $recommendation['service'];
            $replySource = 'trained_db';
        } elseif (!$adminOnline) {
            $geminiReply = app(GeminiChatService::class)->generate(
                $validated['message'],
                $intent,
                $recommendation['service'],
                $recommendation['reply']
            );

            if ($geminiReply) {
                $recommendation['reply'] = $geminiReply;
                $replySource = 'gemini';
            }
        } else {
            $recommendation = $this->adminOnlineReply($intent);
            $replySource = 'admin_online';
        }

        ChatMessage::create([
            'chat_conversation_id' => $conversation->id,
            'sender' => $adminOnline ? 'admin_notice' : 'assistant',
            'message' => $recommendation['reply'],
            'metadata' => [
                'intent' => $intent,
                'service' => $recommendation['service'],
                'admin_online' => $adminOnline,
                'reply_source' => $replySource,
            ],
        ]);

        $this->rememberAnswer(
            $validated['message'],
            $recommendation['reply'],
            $intent,
            $recommendation['service'],
            $replySource
        );

        $this->notifyAdmin($conversation, $validated['message'], $intent);

        return response()->json([
            'status' => true,
            'data' => [
                'session_id' => $conversation->session_id,
                'intent' => $intent,
                'reply' => $recommendation['reply'],
                'service' => $recommendation['service'],
                'admin_online' => $adminOnline,
                'reply_source' => $replySource,
                'next_steps' => [
                    'Discuss the required service and business goal.',
                    'Book a discovery meeting when you are ready.',
                    'Receive a tailored roadmap after the meeting.',
                ],
            ],
        ]);
    }

    private function detectIntent(string $message): string
    {
        return match (true) {
            Str::contains($message, ['urdu', 'roman urdu', 'hindi', 'samaj', 'samj', 'samjhtay', 'samajtay']) => 'language_support',
            Str::contains($message, ['waqar', 'ashraf', 'ceo', 'founder', 'owner']) => 'founder',
            Str::contains($message, ['article', 'blog', 'content', 'schema']) => 'articles',
            Str::contains($message, ['login', 'signup', 'sign up', 'register', 'portal', 'dashboard', 'admin']) => 'login_portal',
            Str::contains($message, ['saas', 'platform', 'software', 'crm', 'erp', 'management system', 'system']) => 'software_platform',
            Str::contains($message, ['ecommerce', 'store', 'shop', 'dukan']) => 'ecommerce',
            Str::contains($message, ['app', 'mobile', 'android', 'ios']) => 'mobile_app',
            Str::contains($message, ['seo', 'ranking', 'google']) => 'seo',
            Str::contains($message, ['marketing', 'ads', 'social']) => 'digital_marketing',
            Str::contains($message, ['ai', 'automation', 'chatbot']) => 'ai_solution',
            Str::contains($message, ['website', 'web', 'site', 'ویب', 'mujhe']) => 'website',
            default => 'consultation',
        };
    }

    private function recommendationFor(string $intent, string $message = ''): array
    {
        $base = [
            'language_support' => [
                'service' => 'Chat Language Support',
                'reply' => 'Ji haan, main Roman Urdu aur English dono samajh sakta hoon. Aap apna sawal simple Roman Urdu mein likh dein, main Verse Next ki services, website, SaaS platform, login portal, SEO, articles, ecommerce ya AI automation ke mutabiq jawab doon ga.',
            ],
            'founder' => [
                'service' => 'Company Information',
                'reply' => 'Verse Next is led by Waqar Ashraf, CEO of versenext.com. The company focuses on professional websites, software systems, SEO-ready content structures, automation, and AI-assisted business workflows.',
            ],
            'articles' => [
                'service' => 'SEO Articles and Content Structure',
                'reply' => 'For articles, we plan SEO-friendly categories, clean URLs, meta titles, meta descriptions, schema-ready content, internal linking, featured images, author details, reading time, and publishing workflows so content can support Google discovery and business leads.',
            ],
            'login_portal' => [
                'service' => 'Login Portals and Admin Dashboards',
                'reply' => 'Yes. We build separate login, signup, user dashboard, and admin dashboard sections when the project needs accounts, secure content, bookings, orders, teams, or protected business workflows. The chat itself stays simple and does not collect personal details.',
            ],
            'software_platform' => [
                'service' => 'SaaS and Software Platform Development',
                'reply' => 'Ji haan, Verse Next SaaS platform aur custom software systems build kar sakta hai. Is mein login/signup, user roles, admin dashboard, subscriptions or account management, APIs, secure database structure, reports, notifications, and scalable Next.js/Laravel architecture include ho sakti hai. Pehle hum platform ka business model aur user flow samajhte hain, phir proper roadmap banate hain.',
            ],
            'ecommerce' => [
                'service' => 'E-commerce Platform',
                'reply' => 'For ecommerce, we usually plan a fast storefront, product management, secure checkout, order flow, analytics, SEO foundations, and conversion tracking. The best next step is a discovery meeting so the store structure matches your business model.',
            ],
            'mobile_app' => [
                'service' => 'Mobile App Development',
                'reply' => 'A mobile app makes sense when you need recurring engagement, push notifications, customer accounts, location features, or device-level interactions. We can discuss iOS, Android, or cross-platform options during the project meeting.',
            ],
            'seo' => [
                'service' => 'SEO Growth Program',
                'reply' => 'For SEO, we should begin with technical structure, page speed, clean metadata, keyword mapping, content planning, schema, internal linking, and search-focused landing pages. The right plan depends on your website, location, and target audience.',
            ],
            'digital_marketing' => [
                'service' => 'Digital Marketing',
                'reply' => 'For marketing, we can connect landing pages, analytics, paid campaigns, retargeting, creative testing, and lead tracking so every campaign has a clear business purpose.',
            ],
            'ai_solution' => [
                'service' => 'AI Automation Solution',
                'reply' => 'AI automation can support customer service, FAQs, lead routing, internal workflows, content assistance, and recommendation flows. We first map the process and business rules so the assistant behaves professionally.',
            ],
            'website' => [
                'service' => 'Website Development',
                'reply' => 'Yes. We build modern, responsive, SEO-ready websites with clean sections, professional UI, fast loading, service pages, article structures, contact flows, and admin-managed content where needed.',
            ],
            'consultation' => [
                'service' => 'Digital Strategy Consultation',
                'reply' => 'I can help with Verse Next services. You can ask about websites, ecommerce, login portals, admin dashboards, articles, SEO, marketing, software, mobile apps, or AI automation. I will explain the service first, then the team can discuss details in a meeting.',
            ],
        ][$intent];

        $knowledge = $intent === 'consultation' ? $this->knowledgeReply($message) : null;

        if ($knowledge) {
            $base['reply'] = $knowledge;
        }

        return $base;
    }

    private function knowledgeReply(string $message): ?string
    {
        $keywords = collect(explode(' ', Str::of($message)->replaceMatches('/[^a-z0-9\s]+/i', ' ')))
            ->filter(fn ($word) => Str::length($word) > 3)
            ->take(6);

        $query = KnowledgeBaseEntry::active()
            ->where(function ($builder) use ($keywords) {
                $builder->where('type', 'chatbot_answer');

                foreach ($keywords as $word) {
                    $builder->orWhere('title', 'like', "%{$word}%")
                        ->orWhere('summary', 'like', "%{$word}%")
                        ->orWhere('content', 'like', "%{$word}%");
                }
            });

        $entry = $query->first();

        return $entry ? trim($entry->summary ?: $entry->content) : null;
    }

    private function learnedAnswerFor(string $message, string $intent): ?ChatbotTrainingExample
    {
        $normalized = $this->normalizeQuestion($message);

        if ($normalized === '') {
            return null;
        }

        $exact = ChatbotTrainingExample::active()
            ->where('normalized_question', $normalized)
            ->first();

        if ($exact) {
            $this->markTrainingExampleUsed($exact);

            return $exact;
        }

        $keywords = collect(explode(' ', $normalized))
            ->filter(fn ($word) => Str::length($word) > 3)
            ->values();

        if ($keywords->count() < 2) {
            return null;
        }

        $candidates = ChatbotTrainingExample::active()
            ->where('intent', $intent)
            ->latest('last_used_at')
            ->limit(60)
            ->get();

        $best = $candidates
            ->map(function (ChatbotTrainingExample $example) use ($keywords) {
                $storedWords = collect(explode(' ', $example->normalized_question))->filter()->values();
                $overlap = $keywords->intersect($storedWords)->count();
                $score = $storedWords->count() > 0 ? $overlap / max($keywords->count(), $storedWords->count()) : 0;

                return ['example' => $example, 'score' => $score];
            })
            ->sortByDesc('score')
            ->first();

        if (($best['score'] ?? 0) < 0.5) {
            return null;
        }

        $this->markTrainingExampleUsed($best['example']);

        return $best['example'];
    }

    private function rememberAnswer(string $question, string $answer, string $intent, string $service, string $source): void
    {
        $normalized = $this->normalizeQuestion($question);

        if ($normalized === '' || Str::length($answer) < 40) {
            return;
        }

        ChatbotTrainingExample::updateOrCreate(
            ['normalized_question' => $normalized],
            [
                'question' => trim($question),
                'answer' => trim($answer),
                'intent' => $intent,
                'service' => $service,
                'source' => $source,
                'is_active' => true,
                'metadata' => [
                    'learned_from' => 'floating_chatbot',
                    'updated_from_session_at' => now()->toIso8601String(),
                ],
            ]
        );
    }

    private function markTrainingExampleUsed(ChatbotTrainingExample $example): void
    {
        $example->forceFill([
            'hit_count' => $example->hit_count + 1,
            'last_used_at' => now(),
        ])->save();
    }

    private function normalizeQuestion(string $question): string
    {
        return Str::of($question)
            ->lower()
            ->ascii()
            ->replaceMatches('/[^a-z0-9\s]+/', ' ')
            ->replaceMatches('/\s+/', ' ')
            ->trim()
            ->limit(255, '')
            ->toString();
    }

    private function adminOnlineReply(string $intent): array
    {
        $service = $this->recommendationFor($intent, '')['service'];

        return [
            'service' => $service,
            'reply' => "Our admin team is online now. I have sent your message to the team, and they can continue the service discussion from here. For now, please ask anything about {$service}; this chat will stay focused on guidance and professional answers.",
        ];
    }

    private function adminOnline(): bool
    {
        $setting = SiteSetting::where('key', 'admin_chat_online')->first();
        $value = $setting?->value;

        return is_array($value) ? (bool) ($value['online'] ?? false) : false;
    }

    private function notifyAdmin(ChatConversation $conversation, string $message, string $intent): void
    {
        $adminEmail = config('mail.admin_address', env('CHAT_ADMIN_EMAIL', config('mail.from.address')));

        if (!$adminEmail) {
            return;
        }

        try {
            Mail::raw(
                "New Verse Next chat message\n\nSession: {$conversation->session_id}\nIntent: {$intent}\n\nMessage:\n{$message}",
                fn ($mail) => $mail->to($adminEmail)->subject('New Verse Next Chat Message')
            );
        } catch (\Throwable) {
            report('Chat admin email could not be sent. Check mail configuration.');
        }
    }
}
