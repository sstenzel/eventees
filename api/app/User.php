<?php

namespace App;

use Carbon\Carbon;
use Illuminate\Auth\Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Lumen\Auth\Authorizable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;

class User extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable;
    use SoftDeletes;

    protected $table = 'user';
    protected $primaryKey = 'id';
    public $timestamps = true;

    protected $fillable = [ 'login', 'email', 'first_name', 'last_name', 'birth', 'city', 'avatar' , 'email_confirmed'];

    protected $hidden = [ 'password', 'remember_token', "deleted_at", "created_at", "updated_at"];



    public  function  createdEvents() {
        return $this->hasMany(Event::class, 'author_id');
    }

    public  function  currentCreatedEvents() {
        return $this->hasMany(Event::class, 'author_id')
            ->where('date', '>', Carbon::today()->subDays(10));
    }

    public  function  mailTokens() {
        return $this->hasMany(ChangeToken::class);
    }

    public  function  participations() {
        return $this->belongsToMany(Event::class);
    }

    public  function  currentParticipations() {
        return $this->belongsToMany(Event::class)
            ->where('date', '>', Carbon::today()->subDays(10));
    }

    public static function avatarInDatabase($avatarName) {
        return User::where('avatar', $avatarName)->get() != null;
    }

    public  function  invitations() {
        return $this->hasMany(Invitation::class, 'invited_user_id')
            ->where('accepted',null)->get();
    }


    public  function  currentInvitations() {
        return $this->hasMany(Invitation::class, 'invited_user_id')
            ->where('accepted',null)
            ->whereHas('event', function ($q) {
                $q->where('date', '>', Carbon::today()->subDays(10));
            });
    }

    public function getInvitation($event_id){
        return $this->hasMany(Invitation::class, 'invited_user_id')
            ->where('event_id',$event_id)->first();
    }

    public  function  comments() {
        return $this->hasMany(Comment::class, 'user_id');
    }

    public  function  role() {
        return $this->belongsTo(Role::class);
    }

    public function isAdmin()
    {
        if ($this->role->id == 1){
           return true;
       }
       return false;
    }

    public function clearEmailTokens () {
        $this->mailTokens()->where('password_recover', false)->delete();
    }


    public function clearPasswordTokens () {
        $this->mailTokens()->where('password_recover', true)->delete();
    }

}


