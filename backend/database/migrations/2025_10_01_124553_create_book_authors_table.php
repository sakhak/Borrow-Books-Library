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
        Schema::create('book_authors', function (Blueprint $table) {
            $table->id("book_author_id");
            $table->unsignedBigInteger("author_id")->unique();
            $table->foreign("author_id")->references("author_id")->on("authors")->onDelete("cascade")->onUpdate("cascade");
            $table->unsignedBigInteger("book_id")->unique();
            $table->foreign("book_id")->references("book_id")->on("books")->onDelete("cascade");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('book_authors');
    }
};
