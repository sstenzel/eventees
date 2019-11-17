<?php

namespace App\Resources;

use Illuminate\Http\Resources\Json\Resource;


class InvitationResource extends Resource
{

    public function toArray($request)
    {

        return [
            'invited_user_id' => (string)$this->invited_user_id,
            'event_id' => (string)$this->event->id,
            'event_name' => (string) $this->event->name,
            'event_date' => (string) $this->event->date,
            'event_time' => (string) $this->event->time,
            'event_place' => (string) $this->event->adress_description,
            'author_id' => (string) $this->author->id,
            'author_login' => (string) $this->author->login,
            'category_name' => $this->event->category->name,
            'category_description' => $this->event->category->description ,
            'category_photo' => $this->event->category->photo ,
            'category_markup' => $this->event->category->markup,
        ];
    }



}