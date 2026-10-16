<?php

namespace Tests\Feature;

use App\Models\Author;
use App\Models\Book;
use App\Models\Borrow;
use App\Models\Member;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class LibraryTest extends TestCase
{
    use RefreshDatabase;

    private array $headers;

    protected function setUp(): void
    {
        parent::setUp();
        DB::table('roles')->insert(['role_id' => 1, 'name' => 'Admin', 'created_at' => now(), 'updated_at' => now()]);
        $user = User::factory()->create();
        $this->headers = ['Authorization' => 'Bearer ' . JWTAuth::fromUser($user), 'Accept' => 'application/json'];
    }

    private function makeBook(int $copies = 2): Book
    {
        $author = Author::create(['name' => 'Test Author']);
        return Book::create([
            'title' => 'Test Book', 'author_id' => $author->author_id,
            'total_copies' => $copies, 'available_copies' => $copies,
        ]);
    }

    private function makeMember(string $phone = '011'): Member
    {
        return Member::create(['member_code' => Member::nextCode(), 'full_name' => 'Jane', 'phone' => $phone, 'joined_date' => now()->toDateString()]);
    }

    public function test_api_requires_authentication(): void
    {
        $this->getJson('/api/books')->assertStatus(401);
    }

    public function test_login_returns_token_and_hides_password(): void
    {
        User::factory()->create(['email' => 'a@b.com', 'password' => 'secret123']);

        $res = $this->postJson('/api/login', ['email' => 'a@b.com', 'password' => 'secret123'])->assertOk();
        $res->assertJsonStructure(['access_token', 'user']);
        $this->assertArrayNotHasKey('password', $res->json('user'));
    }

    public function test_can_create_and_search_books(): void
    {
        $author = Author::create(['name' => 'Orwell']);

        $this->postJson('/api/books', [
            'title' => '1984', 'author_id' => $author->author_id, 'total_copies' => 3,
        ], $this->headers)->assertCreated();

        $this->getJson('/api/books?search=1984', $this->headers)
            ->assertOk()->assertJsonPath('total', 1)->assertJsonPath('data.0.available_copies', 3);
    }

    public function test_borrow_reduces_stock_and_return_restores_it(): void
    {
        $book = $this->makeBook(2);
        $member = $this->makeMember();

        $res = $this->postJson('/api/borrows', ['book_id' => $book->book_id, 'member_id' => $member->member_id], $this->headers)
            ->assertCreated();
        $this->assertSame(1, $book->fresh()->available_copies);

        $this->postJson('/api/borrows/' . $res->json('borrow.borrow_id') . '/return', [], $this->headers)->assertOk();
        $this->assertSame(2, $book->fresh()->available_copies);

        // cannot return twice
        $this->postJson('/api/borrows/' . $res->json('borrow.borrow_id') . '/return', [], $this->headers)->assertStatus(422);
    }

    public function test_cannot_borrow_when_no_copies_left(): void
    {
        $book = $this->makeBook(1);
        $m1 = $this->makeMember('011');
        $m2 = $this->makeMember('022');

        $this->postJson('/api/borrows', ['book_id' => $book->book_id, 'member_id' => $m1->member_id], $this->headers)->assertCreated();
        $this->postJson('/api/borrows', ['book_id' => $book->book_id, 'member_id' => $m2->member_id], $this->headers)
            ->assertStatus(422)->assertJsonValidationErrors('book_id');
    }

    public function test_overdue_return_charges_a_fine(): void
    {
        $book = $this->makeBook(1);
        $member = $this->makeMember();
        $book->decrement('available_copies');
        $borrow = Borrow::create([
            'book_id' => $book->book_id, 'member_id' => $member->member_id,
            'borrow_date' => now()->subDays(20)->toDateString(), 'due_date' => now()->subDays(4)->toDateString(),
        ]);

        $this->assertTrue($borrow->fresh()->is_overdue);

        $this->postJson("/api/borrows/{$borrow->borrow_id}/return", [], $this->headers)
            ->assertOk()->assertJsonPath('borrow.fine_amount', '1.00');
    }

    public function test_cannot_delete_book_with_history_or_lower_copies_below_loans(): void
    {
        $book = $this->makeBook(2);
        $member = $this->makeMember();
        $this->postJson('/api/borrows', ['book_id' => $book->book_id, 'member_id' => $member->member_id], $this->headers)->assertCreated();

        $this->deleteJson("/api/books/{$book->book_id}", [], $this->headers)->assertStatus(409);
        $this->patchJson("/api/books/{$book->book_id}/stock", ['total_copies' => 0], $this->headers)->assertStatus(422);
        $this->patchJson("/api/books/{$book->book_id}/stock", ['total_copies' => 5], $this->headers)->assertOk();
        $this->assertSame(4, $book->fresh()->available_copies);
    }

    public function test_dashboard_and_inventory_endpoints(): void
    {
        $this->makeBook(2);

        $this->getJson('/api/dashboard', $this->headers)->assertOk()
            ->assertJsonPath('stats.titles', 1)->assertJsonCount(6, 'monthly');
        $this->getJson('/api/inventory', $this->headers)->assertOk()
            ->assertJsonPath('summary.total_copies', 2);
    }
}
