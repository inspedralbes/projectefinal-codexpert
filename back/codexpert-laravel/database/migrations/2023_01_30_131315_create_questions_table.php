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
        Schema::create('questions', function (Blueprint $table) {
            $table->id();

            $table->string('statement');
            
            $table->string('userExpectedInput');
            $table->string('userExpectedOutput');

            $table->string('testInput1') -> nullable();
            $table->string('testOutput1') -> nullable();

            $table->string('testInput2') -> nullable();
            $table->string('testOutput2') -> nullable();
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
        Schema::dropIfExists('questions');
    }
};
