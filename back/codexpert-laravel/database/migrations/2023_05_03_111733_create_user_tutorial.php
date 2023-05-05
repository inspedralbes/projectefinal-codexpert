<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_tutorial', function (Blueprint $table) {
            $table->id();

            $table->bigInteger('tutorial_question')->unsigned()->index();
            $table->bigInteger('user_id')->unsigned()->index();

            $table->boolean('locked')->default(true);
            $table->boolean('passed')->default(false);

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('tutorial_question')->references('id')->on('tutorial_questions')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_tutorial');
    }
};
