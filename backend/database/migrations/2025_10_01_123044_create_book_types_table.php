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
       Schema::create('books_types', function (Blueprint $table) {
            $table->id("book_type_id");
            $table->unsignedBigInteger("type_id")->unique();
            // $table->foreign("type_id")->references("type_id")->on("types")->onDelete("cascade")->onUpdate("cascade");
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
        Schema::dropIfExists('book_types');
    }
};
