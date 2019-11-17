<?php

namespace App\Resources;

use Illuminate\Http\Resources\Json\Resource;


class UserEssentialsResource extends Resource
{

    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'login' => $this->login,
            'email' => $this->email,
            'blocked' => $this->blocked
        ];
    }


}