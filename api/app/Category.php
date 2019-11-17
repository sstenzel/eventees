<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{

    protected $table = 'category';
    public $primaryKey = 'id';
    public $timestamps = true;
    protected $hidden = ["deleted_at", "created_at", "updated_at"];


}