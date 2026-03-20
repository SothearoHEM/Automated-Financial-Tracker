<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('budgets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('category');
            $table->decimal('limit_amount', 10, 2);
            $table->string('currency', 3)->default('KHR');
            $table->enum('period', ['weekly', 'monthly']);
            $table->boolean('is_deleted')->default(false);
            $table->timestamps();

            // Indexes and Unique Constraints
            $table->index(['user_id', 'category', 'period', 'currency']);
            $table->unique(['user_id', 'category', 'period'], 'user_budget_period_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('budgets');
    }
};
