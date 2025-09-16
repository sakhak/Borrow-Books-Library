<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use League\CommonMark\Reference\Reference;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id( 'user_id');
            $table->unsignedBigInteger('role_id')->nullable()->default(1);
            $table->unsignedBigInteger('employee_id')->nullable();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('full_name');                        
            $table->string('email')->unique();
            $table->string('password');
            $table->string('phone');
            $table->unsignedBigInteger('age')->check('age >= 4 and age <= 100');
            $table->enum('gender', ['male', 'female','other'])->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('address')->nullable;
            $table->string('image')->nullable;
            $table->boolean('status');
            $table->timestamps();


            $table->foreign('role_id')->references('role_id')->on('roles')->onDelete('cascade');
            $table->foreign('employee_id')->references('employee_id')->on('employees')->onDelete('cascade');
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
