import React from "react";
import CrudPage from "../../../components/crud/CrudPage";
import { STATUS_OPTIONS } from "../../../utils/helpers";
import Badge from "../../../components/ui/Badge";

const columns = [
  { key: "cover", label: "Cover", type: "image" },
  { key: "title", label: "Title" },
  { key: "author.name", label: "Author" },
  { key: "category.name", label: "Category" },
  { key: "isbn", label: "ISBN" },
  {
    key: "copies",
    label: "Available",
    render: (r) => (
      <Badge color={r.available_copies === 0 ? "red" : "green"}>
        {r.available_copies} / {r.total_copies}
      </Badge>
    ),
  },
  { key: "status", label: "Status", type: "status" },
];

const fields = [
  { name: "title", label: "Title", required: true, full: true },
  {
    name: "author_id",
    label: "Author",
    type: "select",
    required: true,
    optionsUrl: "/authors?all=1",
    optionLabel: "name",
    optionValue: "author_id",
  },
  {
    name: "category_id",
    label: "Category",
    type: "select",
    allowEmpty: true,
    optionsUrl: "/categories?all=1",
    optionLabel: "name",
    optionValue: "category_id",
  },
  { name: "isbn", label: "ISBN" },
  { name: "publisher", label: "Publisher" },
  { name: "published_year", label: "Published Year", type: "number", min: 1000 },
  { name: "shelf_location", label: "Shelf Location", placeholder: "e.g. A-3" },
  { name: "total_copies", label: "Total Copies", type: "number", min: 1, required: true, default: 1 },
  { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, required: true, default: 1 },
  { name: "description", label: "Description", type: "textarea" },
  { name: "cover", label: "Cover Image", type: "file" },
];

function Book() {
  return (
    <CrudPage
      title="Books"
      singular="Book"
      endpoint="/books"
      idKey="book_id"
      columns={columns}
      fields={fields}
      searchPlaceholder="Search title, ISBN or author"
    />
  );
}

export default Book;
