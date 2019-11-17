<?php

namespace App;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Invitation extends Model
{

    use SoftDeletes;

    protected $table = 'invitation';
    protected $hidden = ["deleted_at", "created_at", "updated_at"];
    public $timestamps = true;

    public  function  invitedUser() {
        return $this->belongsTo(User::class, 'invited_user_id');
    }


    public  function  event() {
        return $this->belongsTo(Event::class);
    }

    public  function  author() {
        return $this->belongsTo(User::class, 'author_id');
    }


    protected function setKeysForSaveQuery(Builder $query)
    {
        $query
            ->where('invited_user_id', '=', $this->getAttribute('invited_user_id'))
            ->where('event_id', '=', $this->getAttribute('event_id'));
        return $query;
    }

    public static function find( $primaryKeys ) {
        return Invitation::where('invited_user_id', $primaryKeys[0])->where('event_id', $primaryKeys[1])->first();
    }

}