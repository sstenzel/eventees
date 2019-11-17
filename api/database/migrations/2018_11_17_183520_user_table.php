<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UserTable extends Migration
{

    public function up()
    {
        Schema::create('user', function (Blueprint $table) {
            $table->increments('id');
            $table->string('login')->unique();
            $table->string('email')->unique();
            $table->string('password');
            $table->rememberToken();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('sex')->nullable();
            $table->date('birth')->nullable();
            $table->string('city')->nullable();
            $table->string('avatar')->default("avatar.png");
            $table->string('description')->nullable();
            $table->boolean('email_confirmed')->default(false);
            $table->boolean('blocked')->default(false);


            $table->unsignedInteger('role_id')->default(2);
            $table->foreign('role_id')->references('id')->on('role')->onDelete('cascade');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user');
    }
}
