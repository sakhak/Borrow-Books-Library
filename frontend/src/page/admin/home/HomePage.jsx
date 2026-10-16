import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { request } from "../../../utils/request";
import { getErrorMessage, money } from "../../../utils/helpers";
import Badge from "../../../components/ui/Badge";

function HomePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    request("/dashboard", "GET")
      .then(setData)
      .catch((e) => setError(getErrorMessage(e)));
  }, []);

  if (error) return <div className="p-10 text-red-600">{error}</div>;
  if (!data) return <div className="p-10 text-gray-500">Loading dashboard...</div>;

  const { stats, monthly, recent, overdue_list, popular } = data;
  const max = Math.max(1, ...monthly.map((m) => m.count));

  const cards = [
    ["Book titles", stats.titles, "text-main", "/book"],
    ["Copies available", `${stats.available} / ${stats.copies}`, "text-green-600", "/inventory"],
    ["Active members", stats.members, "text-main", "/member"],
    ["Authors", stats.authors, "text-main", "/author"],
    ["Active loans", stats.active_loans, "text-blue-600", "/order"],
    ["Overdue", stats.overdue, stats.overdue ? "text-red-600" : "text-gray-400", "/order"],
    ["Borrowed today", stats.borrowed_today, "text-main", "/order"],
    ["Returned today", stats.returned_today, "text-main", "/order"],
  ];

  return (
    <div className="p-10 space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(([label, value, color, to]) => (
          <Link key={label} to={to} className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition">
            <div className="text-sm text-gray-500">{label}</div>
            <div className={`text-3xl font-bold ${color}`}>{value}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-xl font-bold text-main mb-4">Loans per month</h2>
          <div className="flex items-end gap-4 h-48">
            {monthly.map((m) => (
              <div key={m.label} className="flex-1 flex flex-col items-center justify-end h-full">
                <span className="text-sm mb-1">{m.count}</span>
                <div
                  className="w-full bg-main rounded-t"
                  style={{ height: `${(m.count / max) * 100}%`, minHeight: m.count ? 4 : 2 }}
                />
                <span className="text-xs text-gray-500 mt-2">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-xl font-bold text-main mb-4">Most borrowed books</h2>
          {popular.length === 0 && <p className="text-gray-500">No loans yet.</p>}
          <ol className="space-y-2">
            {popular.map((b, i) => (
              <li key={b.book_id} className="flex justify-between border-b pb-2">
                <span>
                  {i + 1}. {b.title}
                  <span className="text-xs text-gray-500"> — {b.author?.name}</span>
                </span>
                <Badge color="blue">{b.borrows_count} loans</Badge>
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-xl font-bold text-main mb-4">Recent activity</h2>
          {recent.length === 0 && <p className="text-gray-500">No loans yet.</p>}
          <ul className="space-y-2">
            {recent.map((b) => (
              <li key={b.borrow_id} className="flex justify-between border-b pb-2">
                <span>
                  {b.book?.title}
                  <span className="text-xs text-gray-500"> — {b.member?.full_name}</span>
                </span>
                {b.return_date ? <Badge color="green">Returned</Badge> : <Badge color="blue">Due {b.due_date}</Badge>}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-xl font-bold text-red-600 mb-4">Overdue books</h2>
          {overdue_list.length === 0 && <p className="text-gray-500">Nothing overdue. 🎉</p>}
          <ul className="space-y-2">
            {overdue_list.map((b) => (
              <li key={b.borrow_id} className="flex justify-between border-b pb-2">
                <span>
                  {b.book?.title}
                  <span className="text-xs text-gray-500">
                    {" "}
                    — {b.member?.full_name} ({b.member?.phone})
                  </span>
                </span>
                <Badge color="red">
                  {b.days_overdue}d · {money(b.current_fine)}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
