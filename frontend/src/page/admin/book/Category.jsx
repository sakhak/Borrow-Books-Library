import React from "react";
import CrudPage from "../../../components/crud/CrudPage";

const columns = [
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
  { key: "books_count", label: "Books" },
];

const fields = [
  { name: "name", label: "Name", required: true, full: true },
  { name: "description", label: "Description", type: "textarea" },
];

function Category() {
  return (
    <CrudPage
      title="Categories"
      singular="Category"
      endpoint="/categories"
      idKey="category_id"
      columns={columns}
      fields={fields}
      searchPlaceholder="Search categories"
    />
  );
}

export default Category;
