<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KnowledgeBaseEntry;
use App\Models\SiteSetting;
use Illuminate\Http\Request;

class KnowledgeBaseController extends Controller
{
    public function index(Request $request)
    {
        $query = KnowledgeBaseEntry::active();

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        return response()->json([
            'status' => true,
            'data' => $query->get()->groupBy('type'),
        ]);
    }

    public function settings()
    {
        return response()->json([
            'status' => true,
            'data' => SiteSetting::where('is_public', true)->get()->groupBy('group'),
        ]);
    }
}
