<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ClientResponseMail extends Mailable
{
    use Queueable, SerializesModels;

    public $messageContent;
    public $clientName;

    public function __construct($clientName, $messageContent)
    {
        $this->clientName = $clientName;
        $this->messageContent = $messageContent;
    }

    public function build()
    {
        return $this->subject('Response from VerseNext')
                    ->markdown('emails.client.response')
                    ->with([
                        'clientName' => $this->clientName,
                        'messageContent' => $this->messageContent,
                    ]);
    }
}
