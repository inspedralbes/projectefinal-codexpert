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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password'); 
            $table->integer('elo')->default(0); 
            $table->integer('xp')->default(0); 
            $table->integer('coins')->default(0); 
            $table->string('avatar')->default('https://api.dicebear.com/5.x/pixel-art/svg?seed=default'); 
            $table->string('status')->default("Hey, there! Using codeXpert :)"); 
            $table->boolean('banned')->default(false); 
            $table->rememberToken();
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
        Schema::dropIfExists('users');
    }
};
