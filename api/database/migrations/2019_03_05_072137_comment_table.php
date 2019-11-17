<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CommentTable extends Migration
{
    public function up()
    {
        Schema::create('comment', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('user_id');
            $table->unsignedInteger('event_id');
            $table->foreign('user_id')->references('id')->on('user')->onDelete('cascade');
            $table->foreign('event_id')->references('id')->on('event')->onDelete('cascade');
            $table->string('content');
            $table->boolean('blocked')->default(false);

            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('comment');
    }
}
