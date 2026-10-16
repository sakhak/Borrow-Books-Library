<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('categories')) {
            Schema::create('categories', function (Blueprint $table) {
                $table->id('category_id');
                $table->string('name')->unique();
                $table->text('description')->nullable();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('authors')) {
            Schema::create('authors', function (Blueprint $table) {
                $table->id('author_id');
                $table->string('name');
                $table->string('nationality')->nullable();
                $table->text('bio')->nullable();
                $table->string('image')->nullable();
                $table->timestamps();
            });
        } else {
            Schema::table('authors', function (Blueprint $table) {
                if (! Schema::hasColumn('authors', 'nationality')) {
                    $table->string('nationality')->nullable();
                }
                if (! Schema::hasColumn('authors', 'bio')) {
                    $table->text('bio')->nullable();
                }
                if (! Schema::hasColumn('authors', 'image')) {
                    $table->string('image')->nullable();
                }
                if (! Schema::hasColumn('authors', 'created_at')) {
                    $table->timestamp('created_at')->nullable();
                }
                if (! Schema::hasColumn('authors', 'updated_at')) {
                    $table->timestamp('updated_at')->nullable();
                }
            });

            Schema::table('authors', function (Blueprint $table) {
                if (Schema::hasColumn('authors', 'gender')) {
                    $table->string('gender')->nullable()->change();
                }
                if (Schema::hasColumn('authors', 'date_of_birth')) {
                    $table->string('date_of_birth')->nullable()->change();
                }
            });
        }

        if (! Schema::hasTable('books')) {
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
        } else {
            Schema::table('books', function (Blueprint $table) {
                if (! Schema::hasColumn('books', 'isbn')) {
                    $table->string('isbn')->nullable()->unique();
                }
                if (! Schema::hasColumn('books', 'author_id')) {
                    $table->unsignedBigInteger('author_id')->nullable();
                }
                if (! Schema::hasColumn('books', 'category_id')) {
                    $table->unsignedBigInteger('category_id')->nullable();
                }
                if (! Schema::hasColumn('books', 'publisher')) {
                    $table->string('publisher')->nullable();
                }
                if (! Schema::hasColumn('books', 'published_year')) {
                    $table->unsignedSmallInteger('published_year')->nullable();
                }
                if (! Schema::hasColumn('books', 'description')) {
                    $table->text('description')->nullable();
                }
                if (! Schema::hasColumn('books', 'cover')) {
                    $table->string('cover')->nullable();
                }
                if (! Schema::hasColumn('books', 'shelf_location')) {
                    $table->string('shelf_location')->nullable();
                }
                if (! Schema::hasColumn('books', 'total_copies')) {
                    $table->unsignedInteger('total_copies')->default(1);
                }
                if (! Schema::hasColumn('books', 'available_copies')) {
                    $table->unsignedInteger('available_copies')->default(1);
                }
                if (! Schema::hasColumn('books', 'status')) {
                    $table->boolean('status')->default(true);
                }
                if (! Schema::hasColumn('books', 'created_at')) {
                    $table->timestamp('created_at')->nullable();
                }
                if (! Schema::hasColumn('books', 'updated_at')) {
                    $table->timestamp('updated_at')->nullable();
                }
            });

            Schema::table('books', function (Blueprint $table) {
                if (Schema::hasColumn('books', 'book_lang_id')) {
                    $table->unsignedBigInteger('book_lang_id')->nullable()->change();
                }
                foreach (['image', 'qty', 'price'] as $column) {
                    if (Schema::hasColumn('books', $column)) {
                        $table->string($column)->nullable()->change();
                    }
                }
                if (Schema::hasColumn('books', 'release_date')) {
                    $table->dateTime('release_date')->nullable()->change();
                }
            });

            $foreignKeys = Schema::getForeignKeys('books');
            $hasAuthorForeignKey = collect($foreignKeys)->contains(
                fn(array $key) =>
                in_array('author_id', $key['columns'], true) && $key['foreign_table'] === 'authors'
            );
            if (! $hasAuthorForeignKey) {
                Schema::table('books', function (Blueprint $table) {
                    $table->foreign('author_id')->references('author_id')->on('authors')->restrictOnDelete();
                });
            }

            $foreignKeys = Schema::getForeignKeys('books');
            $hasCategoryForeignKey = collect($foreignKeys)->contains(
                fn(array $key) =>
                in_array('category_id', $key['columns'], true) && $key['foreign_table'] === 'categories'
            );
            if (! $hasCategoryForeignKey) {
                Schema::table('books', function (Blueprint $table) {
                    $table->foreign('category_id')->references('category_id')->on('categories')->nullOnDelete();
                });
            }
        }

        if (! Schema::hasTable('members')) {
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
        }

        if (! Schema::hasTable('borrows')) {
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
    }

    public function down(): void
    {
        Schema::dropIfExists('borrows');
        Schema::dropIfExists('members');
    }
};
