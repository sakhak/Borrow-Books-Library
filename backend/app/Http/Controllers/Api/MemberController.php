<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Concerns\ListsRecords;
use App\Http\Controllers\Controller;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MemberController extends Controller
{
    use ListsRecords;

    public function index(Request $request)
    {
        $query = Member::withCount(['borrows as active_loans' => fn ($q) => $q->whereNull('return_date')])
            ->orderByDesc('member_id');

        if ($s = $request->query('search')) {
            $query->where(fn ($q) => $q->where('full_name', 'like', "%{$s}%")
                ->orWhere('member_code', 'like', "%{$s}%")
                ->orWhere('phone', 'like', "%{$s}%")
                ->orWhere('email', 'like', "%{$s}%"));
        }
        if ($request->boolean('active')) {
            $query->where('status', true);
        }

        return $this->listResponse($query, $request);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:members,email',
            'phone' => 'required|string|max:30|unique:members,phone',
            'address' => 'nullable|string|max:255',
            'joined_date' => 'nullable|date',
            'status' => 'nullable',
        ]);
        $data['member_code'] = Member::nextCode();
        $data['joined_date'] = $data['joined_date'] ?? now()->toDateString();
        $data['status'] = $request->boolean('status', true);

        return response()->json(['message' => 'Member created', 'member' => Member::create($data)], 201);
    }

    public function update(Request $request, $id)
    {
        $member = Member::findOrFail($id);
        $data = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => ['nullable', 'email', Rule::unique('members', 'email')->ignore($id, 'member_id')],
            'phone' => ['required', 'string', 'max:30', Rule::unique('members', 'phone')->ignore($id, 'member_id')],
            'address' => 'nullable|string|max:255',
            'joined_date' => 'nullable|date',
            'status' => 'nullable',
        ]);
        $data['status'] = $request->boolean('status', true);
        if (empty($data['joined_date'])) {
            unset($data['joined_date']);
        }
        $member->update($data);

        return response()->json(['message' => 'Member updated', 'member' => $member]);
    }

    public function destroy($id)
    {
        $member = Member::findOrFail($id);
        if ($member->borrows()->exists()) {
            return response()->json(['message' => 'This member has borrowing history and cannot be deleted. Set the member to Inactive instead.'], 409);
        }
        $member->delete();

        return response()->json(['message' => 'Member deleted']);
    }
}
