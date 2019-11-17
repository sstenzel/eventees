<?php

namespace App\Resources;

use Illuminate\Http\Resources\Json\Resource;


class EventResource extends Resource
{

    public function toArray($request)
    {

        return [
            'id' => (string)$this->id,
            'name' => $this->name,
            'description' => $this->description,
            'date' => $this-> date,
            'time' => $this-> time,
            'slots_available' => $this-> slots_available,
            'slots_all' => $this-> slots_all,
            'latitude' => $this-> latitude,
            'longitude' => $this->longitude ,
            'adress_description' => $this-> adress_description,
            'category_name' => $this->category->name,
            'category_description' => $this->category->description ,
            'category_photo' => $this->category->photo ,
            'category_markup' => $this->category->markup,
            'author' => new UserResource($this->author),
            'participants'  =>
                $this->participants
                    ->map(function ($value) {
                        return new UserResource($value);
                    }),
            'invitations' => $this->availableInvitations(),
            'comments' => $this->comments->map(function ($value) {
                return new CommentResource($value);
            })
        ];
    }



}