<?php

namespace App;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Participation extends Model
{

    use SoftDeletes;

    protected $table = 'event_user';
    public $timestamps = true;
    protected $hidden = ["deleted_at", "created_at", "updated_at"];


    public  function  user() {
        return $this->belongsTo(User::class);
    }

    public  function  event() {
        return $this->belongsTo(Event::class);
    }

    protected function setKeysForSaveQuery(Builder $query)
    {
        $query
            ->where('user_id', '=', $this->getAttribute('user_id'))
            ->where('event_id', '=', $this->getAttribute('event_id'));
        return $query;
    }

    public static function find( $primaryKeys ) {
        return Invitation::where('user_id', $primaryKeys[0])->where('event_id', $primaryKeys[1])->first();
    }


}