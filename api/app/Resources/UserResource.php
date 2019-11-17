<?php

namespace App\Resources;

use Illuminate\Http\Resources\Json\Resource;


class UserResource extends Resource
{

    public function toArray($request)
    {
        return [
            'login' => $this->login,
            'email' => $this->email,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'sex' => $this->sex,
            'birth' => $this->birth,
            'city' => $this->city,
            'description' => $this->description,
            'avatar_path' =>  base_path() . '/public/uploads/images/' . $this->avatar,
            'role_id' => $this->role_id,
        ];
    }


}