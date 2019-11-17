<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class BlockedTable extends Migration
{
    public function up()
    {

        Schema::create('blocked', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('user')->onDelete('cascade');
            $table->unsignedInteger('event_id')->nullable();
            $table->foreign('event_id')->references('id')->on('event')->onDelete('cascade');
            $table->unsignedInteger('comment_id')->nullable();
            $table->foreign('comment_id')->references('id')->on('comment')->onDelete('cascade');
            $table->string('reason');
            $table->timestamps();
            $table->softDeletes();
        });
    }


    public function down()
    {
        Schema::dropIfExists('blocked');
    }
}
