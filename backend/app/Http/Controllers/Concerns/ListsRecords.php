<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Http\Request;

trait ListsRecords
{
    /** Return every row (?all=1, for dropdowns) or a paginator (?page=&per_page=). */
    protected function listResponse($query, Request $request)
    {
        if ($request->boolean('all')) {
            return response()->json(['data' => $query->get()]);
        }

        $perPage = min(max($request->integer('per_page', 10), 1), 100);
        return response()->json($query->paginate($perPage));
    }
}
