<?php

namespace App\Resources;

use Illuminate\Http\Resources\Json\Resource;


class UserFullResource extends Resource
{

    public function toArray($request)
    {
        return [
            'id' => (string)$this->id,
            'login' => $this->login,
            'email' => $this->email,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'sex' => $this->sex,
            'birth' => $this->birth,
            'city' => $this->city,
            'description' => $this->description,
            'avatar_path' =>  base_path() . '/public/uploads/images/' . $this->avatar,
            'email_confirmed' => $this->email_confirmed,
            'blocked' => $this->blocked,
            'role_id' => $this->role_id,
            'created_events' => $this->createdEvents,
            'participations' => $this->participations,
            'comments' => $this->comments,
            'invitations' => $this->invitations(),
        ];
    }


}