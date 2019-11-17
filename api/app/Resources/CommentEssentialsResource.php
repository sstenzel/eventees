<?php

namespace App\Resources;

use Illuminate\Http\Resources\Json\Resource;


class CommentEssentialsResource extends Resource
{

    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'author' => $this->author->login,
            'event' => $this->event->name,
            'content' => $this->content,
            'blocked' => $this->blocked
        ];
    }


}