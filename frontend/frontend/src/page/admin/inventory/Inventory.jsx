import React, { useCallback, useEffect, useState } from "react";
import { request } from "../../../utils/request";
import { getErrorMessage, getFieldErrors } from "../../../utils/helpers";
import Modal from "../../../components/ui/Modal";
import Pagination from "../../../components/ui/Pagination";
import Notice from "../../../components/ui/Notice";
import Badge from "../../../components/ui/Badge";

const FILTERS = [
  { key: "", label: "All" },
  { key: "low", label: "Low stock" },
  { key: "out", label: "Out of stock" },
];

const LEVEL = {
  ok: <Badge color="green">In stock</Badge>,
  low: <Badge color="yellow">Low stock</Badge>,
  out: <Badge color="red">Out of stock</Badge>,
};

function Inventory() {
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [filter, setFilter] = useState("");
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const [book, setBook] = useState(null);
  const [copies, setCopies] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const clearNotice = useCallback(() => setNotice(null), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await request(
          `/inventory?page=${page}&per_page=10&stock=${filter}&search=${encodeURIComponent(search)}`,
          "GET"
        );
        if (cancelled) return;
        setRows(res.data || []);
        setSummary(res.summary);
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
  }, [page, filter, search, refresh]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      const res = await request(`/books/${book.book_id}/stock`, "PATCH", { total_copies: Number(copies) });
      setBook(null);
      setNotice({ type: "success", text: res.message });
      setRefresh((n) => n + 1);
    } catch (err) {
      setFormError(getFieldErrors(err).total_copies || getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const cards = summary
    ? [
        ["Titles", summary.titles, "text-main"],
        ["Total copies", summary.total_copies, "text-main"],
        ["Available", summary.available_copies, "text-green-600"],
        ["On loan", summary.borrowed_copies, "text-blue-600"],
        ["Low stock", summary.low_stock, "text-yellow-600"],
        ["Out of stock", summary.out_of_stock, "text-red-600"],
      ]
    : [];

  return (
    <div className="w-full p-10">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        {cards.map(([label, value, color]) => (
          <div key={label} className="bg-white rounded-xl shadow p-4">
            <div className="text-sm text-gray-500">{label}</div>
            <div className={`text-3xl font-bold ${color}`}>{value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white drop-shadow-2xl rounded-2xl">
        <h1 className="text-3xl font-bold pt-5 px-5 text-main">INVENTORY</h1>
        <Notice notice={notice} onClear={clearNotice} />

        <div className="flex flex-wrap items-center gap-4 pt-5 px-5">
          <div className="flex rounded overflow-hidden border">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => {
                  setFilter(f.key);
                  setPage(1);
                }}
                className={`px-4 py-2 ${filter === f.key ? "bg-main text-white" : "bg-white"}`}
              >
                {f.label}
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
              placeholder="Search title or ISBN"
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
                {["Title", "Author", "Shelf", "Total", "Available", "On loan", "Stock", "Action"].map((h) => (
                  <th key={h} className="p-2 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.book_id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{b.title}</td>
                  <td className="p-2">{b.author?.name}</td>
                  <td className="p-2">{b.shelf_location || "—"}</td>
                  <td className="p-2">{b.total_copies}</td>
                  <td className="p-2">{b.available_copies}</td>
                  <td className="p-2">{b.borrowed_copies}</td>
                  <td className="p-2">{LEVEL[b.stock_level]}</td>
                  <td className="p-2">
                    <button
                      className="bg-main text-white px-3 py-1 rounded"
                      onClick={() => {
                        setBook(b);
                        setCopies(b.total_copies);
                        setFormError("");
                      }}
                    >
                      Adjust stock
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500">
                    No books found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={page} lastPage={lastPage} total={total} onChange={setPage} />
      </div>

      <Modal open={!!book} title={`Adjust stock — ${book?.title || ""}`} onClose={() => setBook(null)}>
        <form onSubmit={save} className="space-y-4">
          {formError && <div className="px-3 py-2 bg-red-100 text-red-700 rounded">{formError}</div>}
          <p className="text-sm text-gray-600">
            {book?.borrowed_copies} cop{book?.borrowed_copies === 1 ? "y is" : "ies are"} currently on loan, so the total
            can't go below that.
          </p>
          <div>
            <label className="block text-sm font-semibold mb-1">Total copies</label>
            <input
              type="number"
              min="0"
              required
              className="w-full p-2 border rounded"
              value={copies}
              onChange={(e) => setCopies(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" className="px-4 py-2 border rounded" onClick={() => setBook(null)}>
              Cancel
            </button>
            <button type="submit" disabled={saving} className="px-5 py-2 bg-main text-white rounded disabled:opacity-60">
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Inventory;
