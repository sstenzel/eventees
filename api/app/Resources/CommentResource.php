<?php

namespace App\Resources;

use Illuminate\Http\Resources\Json\Resource;


class CommentResource extends Resource
{

    public function toArray($request)
    {

        return [
            'id' => $this->id,
            'author_login' => $this->author->login,
            'author_avatar' => base_path() . '/public/uploads/images/' . $this->author->avatar,
            'created_at' => $this->created_at,
            'content' => $this->content
        ];
    }



}