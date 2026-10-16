<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Concerns\ListsRecords;
use App\Http\Controllers\Controller;
use App\Models\Author;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AuthorController extends Controller
{
    use ListsRecords;

    private array $rules = [
        'name' => 'required|string|max:255',
        'nationality' => 'nullable|string|max:100',
        'bio' => 'nullable|string',
        'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
    ];

    public function index(Request $request)
    {
        $query = Author::withCount('books')->orderBy('name');
        if ($s = $request->query('search')) {
            $query->where(fn ($q) => $q->where('name', 'like', "%{$s}%")->orWhere('nationality', 'like', "%{$s}%"));
        }
        return $this->listResponse($query, $request);
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules);
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('authors', 'public');
        }

        return response()->json(['message' => 'Author created', 'author' => Author::create($data)], 201);
    }

    public function update(Request $request, $id)
    {
        $author = Author::findOrFail($id);
        $data = $request->validate($this->rules);
        unset($data['image']);

        if ($request->hasFile('image')) {
            if ($author->image) {
                Storage::disk('public')->delete($author->image);
            }
            $data['image'] = $request->file('image')->store('authors', 'public');
        }
        $author->update($data);

        return response()->json(['message' => 'Author updated', 'author' => $author]);
    }

    public function destroy($id)
    {
        $author = Author::withCount('books')->findOrFail($id);
        if ($author->books_count > 0) {
            return response()->json(['message' => 'Cannot delete an author who still has books. Remove or reassign the books first.'], 409);
        }
        if ($author->image) {
            Storage::disk('public')->delete($author->image);
        }
        $author->delete();

        return response()->json(['message' => 'Author deleted']);
    }
}
