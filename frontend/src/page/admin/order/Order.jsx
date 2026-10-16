import React, { useCallback, useEffect, useState } from "react";
import { request } from "../../../utils/request";
import { getErrorMessage, getFieldErrors, money, todayPlus } from "../../../utils/helpers";
import Modal from "../../../components/ui/Modal";
import Pagination from "../../../components/ui/Pagination";
import Notice from "../../../components/ui/Notice";
import Badge from "../../../components/ui/Badge";

const TABS = [
  { key: "", label: "All" },
  { key: "borrowed", label: "Borrowed" },
  { key: "overdue", label: "Overdue" },
  { key: "returned", label: "Returned" },
];

const emptyForm = () => ({ member_id: "", book_id: "", due_date: todayPlus(14), notes: "" });

function statusBadge(b) {
  if (b.return_date) return <Badge color="green">Returned</Badge>;
  if (b.is_overdue) return <Badge color="red">Overdue {b.days_overdue}d</Badge>;
  return <Badge color="blue">Borrowed</Badge>;
}

// Borrowing: issue a book to a member and record its return.
function Order() {
  const [rows, setRows] = useState([]);
  const [tab, setTab] = useState("");
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);

  const clearNotice = useCallback(() => setNotice(null), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await request(
          `/borrows?page=${page}&per_page=10&status=${tab}&search=${encodeURIComponent(search)}`,
          "GET"
        );
        if (cancelled) return;
        setRows(res.data || []);
        setLastPage(res.last_page || 1);
        setTotal(res.total || 0);
      } catch (e) {
        if (!cancelled) setNotice({ type: "error", text: getErrorMessage(e) });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, tab, search, refresh]);

  const openBorrow = async () => {
    setForm(emptyForm());
    setErrors({});
    setFormError("");
    setOpen(true);
    try {
      const [m, b] = await Promise.all([
        request("/members?all=1&active=1", "GET"),
        request("/books?all=1&available=1", "GET"),
      ]);
      setMembers(m.data || []);
      setBooks(b.data || []);
    } catch (e) {
      setFormError(getErrorMessage(e));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setFormError("");
    try {
      const res = await request("/borrows", "POST", form);
      setOpen(false);
      setNotice({ type: "success", text: res.message });
      setPage(1);
      setRefresh((n) => n + 1);
    } catch (err) {
      setErrors(getFieldErrors(err));
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const giveBack = async (b) => {
    if (!window.confirm(`Mark "${b.book?.title}" as returned by ${b.member?.full_name}?`)) return;
    try {
      const res = await request(`/borrows/${b.borrow_id}/return`, "POST");
      setNotice({ type: "success", text: res.message });
      setRefresh((n) => n + 1);
    } catch (err) {
      setNotice({ type: "error", text: getErrorMessage(err) });
    }
  };

  const err = (name) => errors[name] && <p className="text-xs text-red-600 mt-1">{errors[name]}</p>;

  return (
    <div className="w-full p-10">
      <div className="bg-white drop-shadow-2xl rounded-2xl">
        <div className="flex items-center justify-between pt-5 px-5">
          <h1 className="text-3xl font-bold text-main">BORROWING</h1>
          <button className="bg-main text-white px-4 py-2 rounded" onClick={openBorrow}>
            + Borrow a Book
          </button>
        </div>

        <Notice notice={notice} onClear={clearNotice} />

        <div className="flex flex-wrap items-center gap-4 pt-5 px-5">
          <div className="flex rounded overflow-hidden border">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => {
                  setTab(t.key);
                  setPage(1);
                }}
                className={`px-4 py-2 ${tab === t.key ? "bg-main text-white" : "bg-white"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <form
            className="flex gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              setPage(1);
              setSearch(query.trim());
            }}
          >
            <input
              className="p-2 border w-64 rounded"
              placeholder="Search book or member"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="bg-main px-4 py-2 text-white rounded" type="submit">
              Search
            </button>
          </form>
        </div>

        <div className="p-5 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {["#", "Book", "Member", "Borrowed", "Due", "Returned", "Fine", "Status", "Action"].map((h) => (
                  <th key={h} className="p-2 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.borrow_id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{b.borrow_id}</td>
                  <td className="p-2">{b.book?.title}</td>
                  <td className="p-2">
                    {b.member?.full_name}
                    <div className="text-xs text-gray-500">{b.member?.member_code}</div>
                  </td>
                  <td className="p-2">{b.borrow_date}</td>
                  <td className="p-2">{b.due_date}</td>
                  <td className="p-2">{b.return_date || "—"}</td>
                  <td className="p-2">{Number(b.current_fine) > 0 ? money(b.current_fine) : "—"}</td>
                  <td className="p-2">{statusBadge(b)}</td>
                  <td className="p-2">
                    {!b.return_date && (
                      <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => giveBack(b)}>
                        Return
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-6 text-gray-500">
                    No records found
                  </td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan="9" className="text-center py-6 text-gray-500">
                    Loading...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={page} lastPage={lastPage} total={total} onChange={setPage} />
      </div>

      <Modal open={open} title="Borrow a Book" onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="space-y-4">
          {formError && <div className="px-3 py-2 bg-red-100 text-red-700 rounded">{formError}</div>}
          <div>
            <label className="block text-sm font-semibold mb-1">Member *</label>
            <select
              required
              className="w-full p-2 border rounded"
              value={form.member_id}
              onChange={(e) => setForm({ ...form, member_id: e.target.value })}
            >
              <option value="">Select member...</option>
              {members.map((m) => (
                <option key={m.member_id} value={m.member_id}>
                  {m.member_code} — {m.full_name} ({m.active_loans} on loan)
                </option>
              ))}
            </select>
            {err("member_id")}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Book *</label>
            <select
              required
              className="w-full p-2 border rounded"
              value={form.book_id}
              onChange={(e) => setForm({ ...form, book_id: e.target.value })}
            >
              <option value="">Select book...</option>
              {books.map((b) => (
                <option key={b.book_id} value={b.book_id}>
                  {b.title} — {b.author?.name} ({b.available_copies} left)
                </option>
              ))}
            </select>
            {err("book_id")}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Due Date</label>
            <input
              type="date"
              min={todayPlus(0)}
              className="w-full p-2 border rounded"
              value={form.due_date}
              onChange={(e) => setForm({ ...form, due_date: e.target.value })}
            />
            {err("due_date")}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Notes</label>
            <input
              className="w-full p-2 border rounded"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <p className="text-xs text-gray-500">
            Default loan: 14 days · Late fine: $0.25 per day · Max 5 active loans per member.
          </p>
          <div className="flex justify-end gap-3">
            <button type="button" className="px-4 py-2 border rounded" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button type="submit" disabled={saving} className="px-5 py-2 bg-main text-white rounded disabled:opacity-60">
              {saving ? "Saving..." : "Borrow"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Order;
