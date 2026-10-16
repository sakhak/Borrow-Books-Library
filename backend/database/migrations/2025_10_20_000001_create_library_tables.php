<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id('category_id');
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('authors', function (Blueprint $table) {
            $table->id('author_id');
            $table->string('name');
            $table->string('nationality')->nullable();
            $table->text('bio')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();
        });

        Schema::create('books', function (Blueprint $table) {
            $table->id('book_id');
            $table->string('title');
            $table->string('isbn')->nullable()->unique();
            $table->unsignedBigInteger('author_id');
            $table->unsignedBigInteger('category_id')->nullable();
            $table->string('publisher')->nullable();
            $table->unsignedSmallInteger('published_year')->nullable();
            $table->text('description')->nullable();
            $table->string('cover')->nullable();
            $table->string('shelf_location')->nullable();
            $table->unsignedInteger('total_copies')->default(1);
            $table->unsignedInteger('available_copies')->default(1);
            $table->boolean('status')->default(true);
            $table->timestamps();

            $table->foreign('author_id')->references('author_id')->on('authors')->restrictOnDelete();
            $table->foreign('category_id')->references('category_id')->on('categories')->nullOnDelete();
        });

        Schema::create('members', function (Blueprint $table) {
            $table->id('member_id');
            $table->string('member_code')->unique();
            $table->string('full_name');
            $table->string('email')->nullable()->unique();
            $table->string('phone')->unique();
            $table->string('address')->nullable();
            $table->date('joined_date');
            $table->boolean('status')->default(true);
            $table->timestamps();
        });

        Schema::create('borrows', function (Blueprint $table) {
            $table->id('borrow_id');
            $table->unsignedBigInteger('book_id');
            $table->unsignedBigInteger('member_id');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->date('borrow_date');
            $table->date('due_date');
            $table->date('return_date')->nullable();
            $table->decimal('fine_amount', 8, 2)->default(0);
            $table->string('notes')->nullable();
            $table->timestamps();

            $table->foreign('book_id')->references('book_id')->on('books')->restrictOnDelete();
            $table->foreign('member_id')->references('member_id')->on('members')->restrictOnDelete();
            $table->foreign('user_id')->references('user_id')->on('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('borrows');
        Schema::dropIfExists('members');
        Schema::dropIfExists('books');
        Schema::dropIfExists('authors');
        Schema::dropIfExists('categories');
    }
};
