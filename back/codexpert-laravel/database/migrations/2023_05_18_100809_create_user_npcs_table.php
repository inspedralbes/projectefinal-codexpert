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
        Schema::create('user_npcs', function (Blueprint $table) {
            $table->id();

            $table->bigInteger('npc_id')->unsigned()->index();
            $table->bigInteger('user_id')->unsigned()->index(); 

            $table->boolean('haveMet')->default(false);
            
            $table->foreign('npc_id')->references('id')->on('npcs')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
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
        Schema::dropIfExists('user_npcs');
    }
};
