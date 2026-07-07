<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\Admin\AdminInquiryRepositoryInterface;
use App\Http\Resources\Admin\ProjectInquiryResource;

class AdminInquiryController extends Controller
{
    protected $repo;

    public function __construct(AdminInquiryRepositoryInterface $repo)
    {
        $this->repo = $repo;
    }

    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $inquiries = $this->repo->all($perPage);
        return ProjectInquiryResource::collection($inquiries);
    }

    public function show($id)
    {
        $inquiry = $this->repo->find($id);
        return new ProjectInquiryResource($inquiry);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|string']);
        $inquiry = $this->repo->updateStatus($id, $request->status);

        return new ProjectInquiryResource($inquiry);
    }

    public function sendMessage(Request $request, $id)
    {
        $request->validate(['message' => 'required|string']);
        $inquiry = $this->repo->sendMessage($id, $request->message);

        return response()->json([
            'status' => true,
            'message' => 'Message sent successfully',
            'data' => new ProjectInquiryResource($inquiry)
        ]);
    }
}






