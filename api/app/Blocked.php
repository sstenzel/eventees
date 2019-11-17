<?php

namespace App;

use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Lumen\Auth\Authorizable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;

class Blocked extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable;
    use SoftDeletes;

    protected $table = 'blocked';
    protected $primaryKey = 'id';
    public $timestamps = true;

    public  function  user() {
        return $this->belongsTo(User::class);
    }

    public  function  event() {
        return $this->belongsTo(Event::class);
    }

    public  function  comment() {
        return $this->belongsTo(Comment::class);
    }

}


