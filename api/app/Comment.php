<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Comment extends Model
{

    use SoftDeletes;

    protected $table = 'comment';
    public $primaryKey = 'id';
    public $timestamps = true;
    protected $hidden = [ "updated_at"];


    public  function  author() {
        return $this->belongsTo( User::class, 'user_id');
    }

    public  function  event() {
        return $this->belongsTo(Event::class, 'event_id');
    }

}