<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Concerns\ListsRecords;
use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    use ListsRecords;

    public function index(Request $request)
    {
        $query = Category::withCount('books')->orderBy('name');
        if ($s = $request->query('search')) {
            $query->where('name', 'like', "%{$s}%");
        }
        return $this->listResponse($query, $request);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string',
        ]);

        return response()->json(['message' => 'Category created', 'category' => Category::create($data)], 201);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('categories', 'name')->ignore($id, 'category_id')],
            'description' => 'nullable|string',
        ]);
        $category->update($data);

        return response()->json(['message' => 'Category updated', 'category' => $category]);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        // books.category_id is nullOnDelete, so books simply become uncategorised.
        $category->delete();

        return response()->json(['message' => 'Category deleted']);
    }
}
