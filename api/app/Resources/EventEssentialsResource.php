<?php

namespace App\Resources;

use Illuminate\Http\Resources\Json\Resource;


class EventEssentialsResource extends Resource
{

    public function toArray($request)
    {

        return [
            'id' => (string)$this->id,
            'name' => $this->name,
            'date' => $this-> date,
            'time' => $this-> time,
            'adress_description' => $this-> adress_description,
            'author' => $this->author->login,
            'blocked' => $this->blocked
        ];
    }


}