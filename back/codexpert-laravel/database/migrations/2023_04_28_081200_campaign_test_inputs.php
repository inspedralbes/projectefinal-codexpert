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
        Schema::create('campaign_test_inputs', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('question_id')->unsigned()->index();
            $table->string('input') -> nullable();
            $table->foreign('question_id')->references('id')->on('campaign_questions')->onDelete('cascade');
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
        Schema::dropIfExists('campaign_test_inputs');
    }
};
