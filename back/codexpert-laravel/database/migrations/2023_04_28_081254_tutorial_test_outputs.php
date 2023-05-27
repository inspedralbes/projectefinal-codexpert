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
        Schema::create('tutorial_test_outputs', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('question_id')->unsigned()->index();
            $table->string('output') -> nullable();
            $table->foreign('question_id')->references('id')->on('tutorial_questions')->onDelete('cascade');
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
        Schema::dropIfExists('tutorial_test_outputs');
    }
};
