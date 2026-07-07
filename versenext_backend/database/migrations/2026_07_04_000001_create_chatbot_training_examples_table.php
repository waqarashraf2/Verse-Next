<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chatbot_training_examples', function (Blueprint $table) {
            $table->id();
            $table->text('question');
            $table->string('normalized_question')->index();
            $table->longText('answer');
            $table->string('intent')->nullable()->index();
            $table->string('service')->nullable();
            $table->string('source')->default('chatbot');
            $table->unsignedInteger('hit_count')->default(0);
            $table->timestamp('last_used_at')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->unique('normalized_question', 'chatbot_training_examples_question_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chatbot_training_examples');
    }
};
