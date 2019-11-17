<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeTokenTable extends Migration
{
    public function up()
    {

        Schema::create('change_token', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('user_id');
            $table->foreign('user_id')->references('id')->on('user')->onDelete('cascade');
            $table->string('prev_email')->nullable();
            $table->string('new_email')->nullable();
            $table->boolean('password_recover')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }


    public function down()
    {
        Schema::dropIfExists('change_token');
    }
}
