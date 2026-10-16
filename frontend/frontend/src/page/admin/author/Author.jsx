import React from "react";
import CrudPage from "../../../components/crud/CrudPage";

const columns = [
  { key: "image", label: "Photo", type: "image" },
  { key: "name", label: "Name" },
  { key: "nationality", label: "Nationality" },
  { key: "books_count", label: "Books" },
  { key: "bio", label: "Bio", render: (r) => (r.bio ? r.bio.slice(0, 60) + (r.bio.length > 60 ? "…" : "") : "—") },
];

const fields = [
  { name: "name", label: "Name", required: true },
  { name: "nationality", label: "Nationality" },
  { name: "bio", label: "Biography", type: "textarea" },
  { name: "image", label: "Photo", type: "file" },
];

function Author() {
  return (
    <CrudPage
      title="Authors"
      singular="Author"
      endpoint="/authors"
      idKey="author_id"
      columns={columns}
      fields={fields}
      searchPlaceholder="Search by name or nationality"
    />
  );
}

export default Author;
