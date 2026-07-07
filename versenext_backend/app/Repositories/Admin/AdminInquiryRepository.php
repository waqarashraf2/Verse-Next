<?php

namespace App\Repositories\Admin;

use App\Models\ProjectInquiry;
use Illuminate\Support\Facades\Mail;
use App\Mail\ClientInquiryMessageMail;

class AdminInquiryRepository implements AdminInquiryRepositoryInterface
{
    public function all($perPage = 10)
    {
        return ProjectInquiry::latest()->paginate($perPage);
    }

    public function find($id)
    {
        return ProjectInquiry::findOrFail($id);
    }

    public function updateStatus($id, $status)
    {
        $inquiry = $this->find($id);
        $inquiry->update(['status' => $status]);
        return $inquiry;
    }

    public function sendMessage($id, $message)
    {
        $inquiry = $this->find($id);

        Mail::to($inquiry->email)
            ->queue(new ClientInquiryMessageMail($inquiry, $message));

        return $inquiry;
    }
}
