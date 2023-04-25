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
        Schema::create('user_games', function (Blueprint $table) {
            $table->id();

            $table->bigInteger('game_id')->unsigned()->index();
            $table->bigInteger('user_id')->unsigned()->index();

            $table->integer('hearts_remaining')->default(5);
            $table->integer('perks_used')->default(0);
            $table->integer('question_at')->default(0);
            $table->boolean('dead')->default(false);
            $table->boolean('finished')->default(false);

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('game_id')->references('id')->on('games')->onDelete('cascade');

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
        Schema::dropIfExists('user_game');
    }
};
