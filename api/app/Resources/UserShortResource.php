<?php

namespace App\Resources;

use Illuminate\Http\Resources\Json\Resource;


class UserShortResource extends Resource
{

    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'login' => $this->login,
            'avatar_path' =>  base_path() . '/public/uploads/images/' . $this->avatar
        ];
    }


}