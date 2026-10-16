import React from "react";

function Pagination({ page, lastPage, total, onChange }) {
  return (
    <div className="flex items-center justify-between px-5 pb-5 text-sm text-gray-600">
      <span>{total} record(s)</span>
      <div className="flex items-center gap-2">
        <button
          className="px-3 py-1 border rounded disabled:opacity-40"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
        >
          Prev
        </button>
        <span>
          Page {page} of {lastPage}
        </span>
        <button
          className="px-3 py-1 border rounded disabled:opacity-40"
          disabled={page >= lastPage}
          onClick={() => onChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Pagination;
