<?php

namespace Database\Seeders;

use App\Models\Author;
use App\Models\Book;
use App\Models\Category;
use App\Models\Member;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Roles (users.role_id defaults to 1, so "Admin" must exist)
        foreach ([1 => 'Admin', 2 => 'Librarian'] as $id => $name) {
            DB::table('roles')->updateOrInsert(['role_id' => $id], ['name' => $name, 'created_at' => now(), 'updated_at' => now()]);
        }

        // Default admin login: admin@library.com / password123 (change after first login!)
        User::firstOrCreate(['email' => 'admin@library.com'], [
            'role_id' => 1,
            'first_name' => 'Library',
            'last_name' => 'Admin',
            'full_name' => 'Library Admin',
            'password' => 'password123',
            'phone' => '012345678',
            'age' => 30,
            'gender' => 'other',
            'date_of_birth' => '1995-01-01',
            'address' => 'Phnom Penh',
            'status' => true,
        ]);

        if (Book::exists()) {
            return; // demo data only on an empty library
        }

        $cats = collect(['Fiction', 'Science', 'History', 'Technology'])
            ->mapWithKeys(fn ($n) => [$n => Category::create(['name' => $n])]);

        $authors = collect([
            ['name' => 'George Orwell', 'nationality' => 'British'],
            ['name' => 'Yuval Noah Harari', 'nationality' => 'Israeli'],
            ['name' => 'Robert C. Martin', 'nationality' => 'American'],
        ])->map(fn ($a) => Author::create($a));

        $books = [
            ['1984', '9780451524935', 0, 'Fiction', 1949, 3],
            ['Animal Farm', '9780451526342', 0, 'Fiction', 1945, 2],
            ['Sapiens', '9780062316097', 1, 'History', 2011, 4],
            ['Homo Deus', '9780062464316', 1, 'Science', 2015, 2],
            ['Clean Code', '9780132350884', 2, 'Technology', 2008, 3],
        ];
        foreach ($books as [$title, $isbn, $a, $cat, $year, $copies]) {
            Book::create([
                'title' => $title, 'isbn' => $isbn,
                'author_id' => $authors[$a]->author_id, 'category_id' => $cats[$cat]->category_id,
                'published_year' => $year, 'total_copies' => $copies, 'available_copies' => $copies,
                'shelf_location' => strtoupper(substr($cat, 0, 1)) . '-' . rand(1, 9),
            ]);
        }

        foreach ([['Sokha Chan', '011111111'], ['Dara Kim', '022222222'], ['Srey Neang', '033333333']] as [$name, $phone]) {
            Member::create([
                'member_code' => Member::nextCode(), 'full_name' => $name,
                'phone' => $phone, 'joined_date' => now()->toDateString(),
            ]);
        }
    }
}
