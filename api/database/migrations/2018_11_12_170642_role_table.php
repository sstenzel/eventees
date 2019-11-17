<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RoleTable extends Migration
{
    public function up()
    {

        Schema::create('role', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->unique();
            $table->string('description')->nullable();
        });
    }


    public function down()
    {
        Schema::dropIfExists('role');
    }
}
