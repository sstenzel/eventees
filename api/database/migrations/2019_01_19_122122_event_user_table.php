<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class EventUserTable extends Migration
{

    public function up()
    {
        Schema::create('event_user', function (Blueprint $table) {
            $table->index(['event_id', 'user_id']);
            $table->unsignedInteger('user_id');
            $table->unsignedInteger('event_id');
            $table->foreign('user_id')->references('id')->on('user')->onDelete('cascade');
            $table->foreign('event_id')->references('id')->on('event')->onDelete('cascade');
            $table->boolean('resigned')->default(false);

            $table->softDeletes();
            $table->timestamps();
        });
    }


    public function down()
    {
        Schema::dropIfExists('event_user');
    }
}
