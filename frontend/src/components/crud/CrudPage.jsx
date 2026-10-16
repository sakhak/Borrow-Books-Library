import React, { useCallback, useEffect, useState } from "react";
import { request } from "../../utils/request";
import { fileUrl, getErrorMessage, getFieldErrors, getPath, isActive, money } from "../../utils/helpers";
import Modal from "../ui/Modal";
import Pagination from "../ui/Pagination";
import Notice from "../ui/Notice";
import Badge from "../ui/Badge";

const inputCls = "w-full p-2 border rounded focus:outline-none focus:border-main";

/**
 * Config-driven list + create/edit modal + delete page.
 * columns: [{ key, label, type?: 'image'|'status'|'money', render?: (row) => node }]
 * fields:  [{ name, label, type?, required?, requiredOnCreate?, options?, optionsUrl?, optionLabel?,
 *             optionValue?, allowEmpty?, default?, full?, hint? }]
 */
function CrudPage({
  title,
  singular,
  endpoint,
  urls,
  idKey,
  columns,
  fields,
  transform,
  searchPlaceholder = "Search...",
}) {
  const u = {
    list: endpoint,
    create: endpoint,
    update: (id) => `${endpoint}/${id}`,
    remove: (id) => `${endpoint}/${id}`,
    ...urls,
  };

  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [optionsMap, setOptionsMap] = useState({});

  const clearNotice = useCallback(() => setNotice(null), []);

  // Load rows
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const sep = u.list.includes("?") ? "&" : "?";
        const res = await request(
          `${u.list}${sep}page=${page}&per_page=10&search=${encodeURIComponent(search)}`,
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
    };
    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, refresh]);

  // Load dropdown options (e.g. authors for the book form)
  useEffect(() => {
    fields
      .filter((f) => f.optionsUrl)
      .forEach(async (f) => {
        try {
          const res = await request(f.optionsUrl, "GET");
          setOptionsMap((m) => ({ ...m, [f.name]: res.data || [] }));
        } catch (e) {
          setNotice({ type: "error", text: getErrorMessage(e) });
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialValues = (record) => {
    const v = {};
    fields.forEach((f) => {
      if (f.type === "file" || f.type === "password") {
        v[f.name] = f.type === "file" ? null : "";
      } else if (record) {
        const raw = record[f.name];
        v[f.name] = raw === true ? 1 : raw === false ? 0 : raw ?? "";
      } else {
        v[f.name] = f.default ?? "";
      }
    });
    return v;
  };

  const openCreate = () => {
    setEditing(null);
    setValues(initialValues(null));
    setErrors({});
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setValues(initialValues(row));
    setErrors({});
    setFormError("");
    setModalOpen(true);
  };

  const setField = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setFormError("");
    try {
      const payload = transform ? transform(values) : values;
      const fd = new FormData();
      Object.entries(payload).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        fd.append(k, v instanceof File ? v : v === true ? 1 : v === false ? 0 : v);
      });
      let res;
      if (editing) {
        fd.append("_method", "PUT"); // Laravel can't read multipart PUT bodies, so spoof it
        res = await request(u.update(editing[idKey]), "POST", fd);
      } else {
        res = await request(u.create, "POST", fd);
      }
      setModalOpen(false);
      setNotice({ type: "success", text: res?.message || "Saved" });
      setRefresh((n) => n + 1);
    } catch (err) {
      setErrors(getFieldErrors(err));
      setFormError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row) => {
    if (!window.confirm(`Delete this ${singular.toLowerCase()}?`)) return;
    try {
      const res = await request(u.remove(row[idKey]), "DELETE");
      setNotice({ type: "success", text: res?.message || "Deleted" });
      if (rows.length === 1 && page > 1) setPage(page - 1);
      else setRefresh((n) => n + 1);
    } catch (err) {
      setNotice({ type: "error", text: getErrorMessage(err) });
    }
  };

  const renderCell = (col, row) => {
    if (col.render) return col.render(row);
    const val = getPath(row, col.key);
    if (col.type === "image") {
      return val ? (
        <img src={fileUrl(val)} alt="" className="w-10 h-10 rounded object-cover mx-auto" />
      ) : (
        <span className="text-gray-300">—</span>
      );
    }
    if (col.type === "status") {
      return <Badge color={isActive(val) ? "green" : "gray"}>{isActive(val) ? "Active" : "Inactive"}</Badge>;
    }
    if (col.type === "money") return money(val);
    return val === null || val === undefined || val === "" ? "—" : String(val);
  };

  const renderField = (f) => {
    const required = f.required || (f.requiredOnCreate && !editing);
    const common = {
      id: `f-${f.name}`,
      className: inputCls,
      required,
      value: f.type === "file" ? undefined : values[f.name] ?? "",
      onChange: (e) => setField(f.name, e.target.value),
    };
    let control;
    if (f.type === "textarea") {
      control = <textarea rows={3} {...common} />;
    } else if (f.type === "select") {
      const opts = f.options || (optionsMap[f.name] || []).map((o) => ({
        value: o[f.optionValue],
        label: o[f.optionLabel],
      }));
      control = (
        <select {...common}>
          {(f.allowEmpty || !required) && <option value="">{f.allowEmpty ? "— None —" : "Select..."}</option>}
          {required && !f.allowEmpty && <option value="" disabled>Select...</option>}
          {opts.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    } else if (f.type === "file") {
      const current = editing && editing[f.name];
      control = (
        <div className="flex items-center gap-3">
          {values[f.name] ? (
            <img src={URL.createObjectURL(values[f.name])} alt="" className="w-12 h-12 rounded object-cover" />
          ) : current ? (
            <img src={fileUrl(current)} alt="" className="w-12 h-12 rounded object-cover" />
          ) : null}
          <input
            id={`f-${f.name}`}
            type="file"
            accept="image/png,image/jpeg"
            onChange={(e) => setField(f.name, e.target.files[0] || null)}
          />
        </div>
      );
    } else {
      control = (
        <input
          type={f.type || "text"}
          step={f.step}
          min={f.min}
          max={f.max}
          placeholder={f.placeholder}
          {...common}
        />
      );
    }
    return (
      <div key={f.name} className={f.full || f.type === "textarea" ? "md:col-span-2" : ""}>
        <label htmlFor={`f-${f.name}`} className="block text-sm font-semibold mb-1">
          {f.label}
          {required && <span className="text-red-500"> *</span>}
        </label>
        {control}
        {f.hint && editing && <p className="text-xs text-gray-500 mt-1">{f.hint}</p>}
        {errors[f.name] && <p className="text-xs text-red-600 mt-1">{errors[f.name]}</p>}
      </div>
    );
  };

  return (
    <div className="w-full p-10">
      <div className="w-auto bg-white drop-shadow-2xl rounded-2xl">
        <div className="flex items-center justify-between pt-5 px-5">
          <h1 className="text-3xl font-bold text-main uppercase">{title}</h1>
          <button className="bg-main text-white px-4 py-2 rounded" onClick={openCreate}>
            + Add {singular}
          </button>
        </div>

        <Notice notice={notice} onClear={clearNotice} />

        <form
          className="flex gap-3 pt-5 px-5 items-center"
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            setSearch(query.trim());
          }}
        >
          <input
            className="p-2 border w-72 rounded"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="bg-main px-4 py-2 text-white rounded" type="submit">
            Search
          </button>
          {search && (
            <button
              type="button"
              className="px-3 py-2 border rounded"
              onClick={() => {
                setQuery("");
                setSearch("");
                setPage(1);
              }}
            >
              Clear
            </button>
          )}
        </form>

        <div className="p-5 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {columns.map((c) => (
                  <th key={c.label} className="p-2 text-left">
                    {c.label}
                  </th>
                ))}
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row[idKey]} className="border-b hover:bg-gray-50">
                  {columns.map((c) => (
                    <td key={c.label} className="p-2 align-middle">
                      {renderCell(c, row)}
                    </td>
                  ))}
                  <td className="p-2 text-center whitespace-nowrap">
                    <button className="bg-main text-white px-3 py-1 mr-2 rounded" onClick={() => openEdit(row)}>
                      Edit
                    </button>
                    <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => remove(row)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center py-6 text-gray-500">
                    No {title.toLowerCase()} found
                  </td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center py-6 text-gray-500">
                    Loading...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={page} lastPage={lastPage} total={total} onChange={setPage} />
      </div>

      <Modal
        open={modalOpen}
        wide
        title={editing ? `Edit ${singular}` : `Add ${singular}`}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={submit}>
          {formError && <div className="mb-4 px-3 py-2 bg-red-100 text-red-700 rounded">{formError}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{fields.map(renderField)}</div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" className="px-4 py-2 border rounded" onClick={() => setModalOpen(false)}>
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

export default CrudPage;
