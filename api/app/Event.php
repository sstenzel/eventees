<?php

namespace App;

use App\Resources\EventShortenedResource;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{

    use SoftDeletes;

    protected $table = 'event';
    protected $primaryKey = 'id';
    public $timestamps = true;
    protected $hidden = ["deleted_at", "created_at", "updated_at"];



    public  function  author() {
        return $this->belongsTo(User::class);
    }

    public  function  category() {
        return $this->belongsTo(Category::class);
    }

    public  function  participants() {
        return $this->belongsToMany(User::class);
    }


    public  function  isParticipant($user_id) {
        $participant = $this->belongsToMany(User::class)->where('user_id', $user_id)->first();

        if(!empty($participant)) {
            return true;
        }
        return false;
    }

    public  function  comments() {
        return $this->hasMany(Comment::class, 'event_id');
    }

    public  function  availableInvitations() {
        return $this->hasMany(Invitation::class, 'event_id')->where('accepted',null)->get();
    }

    public  function  invitations() {
        return $this->hasMany(Invitation::class, 'event_id');
    }

    public static function toShortenedResourceArray ($events)
    {
        return $events
            ->map(function ($value) {
                return new EventShortenedResource($value);
            });
    }

}