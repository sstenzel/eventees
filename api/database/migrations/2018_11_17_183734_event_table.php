<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class EventTable extends Migration
{
    public function up()
    {
        Schema::create('event', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('description');
            $table->date('date');
            $table->time('time');
            $table->unsignedInteger('slots_available');
            $table->unsignedInteger('slots_all');
            $table->unsignedInteger('author_id');
            $table->double('latitude');
            $table->double('longitude');
            $table->string('adress_description');
            $table->unsignedInteger('category_id');
            $table->foreign('author_id')->references('id')->on('user')->onDelete('cascade');
            $table->foreign('category_id')->references('id')->on('category')->onDelete('cascade');
            $table->boolean('blocked')->default(false);

            $table->softDeletes();
            $table->timestamps();

        });
    }

   public function down()
    {
        Schema::dropIfExists('event');
    }
}
