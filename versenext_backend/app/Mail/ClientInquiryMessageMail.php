<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\ProjectInquiry;

class ClientInquiryMessageMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $inquiry;
    public $messageContent;

    public function __construct(ProjectInquiry $inquiry, $messageContent)
    {
        $this->inquiry = $inquiry;
        $this->messageContent = $messageContent;
    }

    public function build()
    {
        return $this->subject('Message from VerseNext')
                    ->markdown('emails.client_message');
    }
}
