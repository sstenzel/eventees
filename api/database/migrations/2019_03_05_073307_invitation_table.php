<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class InvitationTable extends Migration
{
    public function up()
    {
        Schema::create('invitation', function (Blueprint $table) {
            $table->index('invited_user_id', 'event_id');

            $table->unsignedInteger('invited_user_id');
            $table->foreign('invited_user_id')->references('id')->on('user')->onDelete('cascade');

            $table->unsignedInteger('event_id');
            $table->foreign('event_id')->references('id')->on('event')->onDelete('cascade');

            $table->unsignedInteger('author_id');
            $table->foreign('author_id')->references('id')->on('user')->onDelete('cascade');

//            $table->string('content')->nullable(true);
            $table->boolean("accepted")->nullable(true);

            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('invitation');
    }
}
