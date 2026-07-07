<?php

namespace App\Repositories\Admin;

use App\Models\ProjectInquiry;

interface AdminInquiryRepositoryInterface
{
    public function all($perPage = 10);
    public function find($id);
    public function updateStatus($id, $status);
    public function sendMessage($id, $message);
}
