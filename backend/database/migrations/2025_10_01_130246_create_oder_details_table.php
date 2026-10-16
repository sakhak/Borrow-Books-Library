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
        Schema::create('oder_details', function (Blueprint $table) {
            $table->id("order_detail_id");
            $table->unsignedBigInteger("order_id")->unique();
            $table->foreign("order_id")->references("order_id")->on("oders")->onDelete("cascade");
            $table->unsignedBigInteger("book_id")->unique();
            $table->foreign("book_id")->references("book_id")->on("books")->onDelete("cascade");
            $table->string("price");
            $table->string("qty");
            $table->string("amount");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('oder_details');
    }
};
