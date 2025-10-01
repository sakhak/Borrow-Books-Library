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
    Schema::create('book_languages', function (Blueprint $table) {
        $table->id('book_lang_id'); // UNSIGNED BIGINT AUTO_INCREMENT
        // $table->foreign("book_lang_id")->references("book_lang_id")->on("books")->onDelete("cascade");
        $table->string('country');
        $table->string('language');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('book_languages');
    }
};
