<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'source' => 'nullable|string|max:100',
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'whatsapp' => 'nullable|string|max:50',
            'service' => 'nullable|string|max:255',
            'budget' => 'nullable|string|max:100',
            'timeline' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
            'metadata' => 'nullable|array',
        ]);

        if (empty($validated['email']) && empty($validated['phone']) && empty($validated['whatsapp'])) {
            return response()->json([
                'status' => false,
                'message' => 'Please provide at least an email, phone, or WhatsApp number.',
            ], 422);
        }

        $lead = Lead::create([
            ...$validated,
            'source' => $validated['source'] ?? 'website',
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Lead captured successfully.',
            'data' => $lead,
        ], 201);
    }
}
