<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class Email extends Mailable implements ShouldQueue
{

    use Queueable, SerializesModels;

    public $view, $email, $contentData, $subject;


    public function __construct($view, $subject, $email,  $contentData)
    {
        $this->view = $view;
        $this->email = $email;
        $this->contentData =  $contentData;
        $this->subject = env("APP_NAME") . " - " . $subject;

    }


    public function build()
    {
        return $this->view('mail.' . $this->view)
        ->with($this->contentData)
            ->to($this->email)
            ->subject($this->subject);

    }
}