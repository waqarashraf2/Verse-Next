<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\ChatbotTrainingExample;
use App\Models\Consultation;
use App\Models\KnowledgeBaseEntry;
use App\Models\Lead;
use App\Models\SiteSetting;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class AdminPlatformController extends Controller
{
    public function dashboard()
    {
        return response()->json([
            'status' => true,
            'data' => [
                'leads' => Lead::count(),
                'new_leads' => Lead::where('status', 'new')->count(),
                'consultations' => Consultation::count(),
                'requested_consultations' => Consultation::where('status', 'requested')->count(),
                'articles' => Article::count(),
                'published_articles' => Article::where('status', 'published')->count(),
                'knowledge_entries' => KnowledgeBaseEntry::count(),
                'chatbot_training_examples' => ChatbotTrainingExample::count(),
                'admin_chat_online' => $this->chatPresenceValue()['online'],
            ],
        ]);
    }

    public function leads(Request $request)
    {
        return Lead::latest()->paginate($request->integer('per_page', 15));
    }

    public function updateLead(Request $request, Lead $lead)
    {
        $lead->update($request->validate([
            'status' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
            'metadata' => 'nullable|array',
        ]));

        return response()->json(['status' => true, 'data' => $lead]);
    }

    public function consultations(Request $request)
    {
        return Consultation::latest()->paginate($request->integer('per_page', 15));
    }

    public function updateConsultation(Request $request, Consultation $consultation)
    {
        $consultation->update($request->validate([
            'preferred_date' => 'nullable|date',
            'preferred_time' => 'nullable|string|max:50',
            'status' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
        ]));

        return response()->json(['status' => true, 'data' => $consultation]);
    }

    public function articles(Request $request)
    {
        return Article::latest()->paginate($request->integer('per_page', 15));
    }

    public function storeArticle(Request $request)
    {
        return response()->json([
            'status' => true,
            'data' => Article::create($this->articleData($request)),
        ], 201);
    }

    public function updateArticle(Request $request, Article $article)
    {
        $article->update($this->articleData($request, true));

        return response()->json(['status' => true, 'data' => $article]);
    }

    public function destroyArticle(Article $article)
    {
        $article->delete();

        return response()->json(['status' => true]);
    }

    public function knowledge(Request $request)
    {
        return KnowledgeBaseEntry::orderBy('type')->orderBy('sort_order')->paginate($request->integer('per_page', 30));
    }

    public function chatbotTraining(Request $request)
    {
        return ChatbotTrainingExample::query()
            ->when($request->string('intent')->toString(), fn ($query, $intent) => $query->where('intent', $intent))
            ->orderByDesc('hit_count')
            ->latest()
            ->paginate($request->integer('per_page', 30));
    }

    public function storeKnowledge(Request $request)
    {
        return response()->json([
            'status' => true,
            'data' => KnowledgeBaseEntry::create($this->knowledgeData($request)),
        ], 201);
    }

    public function updateKnowledge(Request $request, KnowledgeBaseEntry $entry)
    {
        $entry->update($this->knowledgeData($request, true));

        return response()->json(['status' => true, 'data' => $entry]);
    }

    public function destroyKnowledge(KnowledgeBaseEntry $entry)
    {
        $entry->delete();

        return response()->json(['status' => true]);
    }

    public function settings()
    {
        return SiteSetting::orderBy('group')->orderBy('key')->get()->groupBy('group');
    }

    public function upsertSetting(Request $request)
    {
        $validated = $request->validate([
            'group' => 'nullable|string|max:100',
            'key' => 'required|string|max:150',
            'value' => 'nullable',
            'is_public' => 'nullable|boolean',
        ]);

        $setting = SiteSetting::updateOrCreate(
            ['key' => $validated['key']],
            [
                'group' => $validated['group'] ?? 'general',
                'value' => $validated['value'] ?? null,
                'is_public' => $validated['is_public'] ?? false,
            ]
        );

        return response()->json(['status' => true, 'data' => $setting]);
    }

    public function chatPresence()
    {
        return response()->json([
            'status' => true,
            'data' => $this->chatPresenceValue(),
        ]);
    }

    public function updateChatPresence(Request $request)
    {
        $validated = $request->validate([
            'online' => 'required|boolean',
        ]);

        $setting = SiteSetting::updateOrCreate(
            ['key' => 'admin_chat_online'],
            [
                'group' => 'chat',
                'value' => [
                    'online' => $validated['online'],
                    'updated_at' => now()->toIso8601String(),
                ],
                'is_public' => false,
            ]
        );

        return response()->json([
            'status' => true,
            'data' => $setting->value,
        ]);
    }

    private function articleData(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'title' => [$required, 'string', 'max:255'],
            'slug' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:150',
            'featured_image' => 'nullable|string|max:500',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string',
            'author' => 'nullable|string|max:255',
            'reading_time' => 'nullable|integer|min:1',
            'tags' => 'nullable|array',
            'content' => [$required, 'string'],
            'status' => 'nullable|string|max:50',
            'is_featured' => 'nullable|boolean',
            'published_at' => 'nullable|date',
            'scheduled_at' => 'nullable|date',
        ]);
    }

    private function knowledgeData(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'type' => [$required, 'string', 'max:100'],
            'title' => [$required, 'string', 'max:255'],
            'slug' => 'nullable|string|max:255',
            'summary' => 'nullable|string',
            'content' => 'nullable|string',
            'data' => 'nullable|array',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min:0',
        ]);
    }

    private function chatPresenceValue(): array
    {
        $value = SiteSetting::where('key', 'admin_chat_online')->first()?->value;

        return is_array($value) ? [
            'online' => (bool) ($value['online'] ?? false),
            'updated_at' => $value['updated_at'] ?? null,
        ] : [
            'online' => false,
            'updated_at' => null,
        ];
    }
}
