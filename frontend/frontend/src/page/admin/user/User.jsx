import React from "react";
import CrudPage from "../../../components/crud/CrudPage";
import { STATUS_OPTIONS } from "../../../utils/helpers";

const columns = [
  { key: "image", label: "Photo", type: "image" },
  { key: "full_name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "role_id", label: "Role", render: (r) => (r.role_id === 1 ? "Admin" : "Librarian") },
  { key: "status", label: "Status", type: "status" },
];

const fields = [
  { name: "first_name", label: "First Name", required: true },
  { name: "last_name", label: "Last Name", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone", required: true },
  { name: "age", label: "Age", type: "number", min: 4, max: 100, required: true },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    required: true,
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "other", label: "Other" },
    ],
  },
  { name: "date_of_birth", label: "Date of Birth", type: "date", required: true },
  { name: "address", label: "Address", required: true },
  { name: "password", label: "Password", type: "password", requiredOnCreate: true, hint: "Leave blank to keep the current password." },
  { name: "password_confirmation", label: "Confirm Password", type: "password", requiredOnCreate: true },
  { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, required: true, default: 1 },
  { name: "image", label: "Photo", type: "file" },
];

function User() {
  return (
    <CrudPage
      title="Users"
      singular="User"
      urls={{
        list: "/users",
        create: "/users",
        update: (id) => `/updateuser/${id}`,
        remove: (id) => `/users/${id}`,
      }}
      idKey="user_id"
      columns={columns}
      fields={fields}
      transform={(v) => ({ ...v, full_name: `${v.first_name} ${v.last_name}`.trim() })}
      searchPlaceholder="Search name, email or phone"
    />
  );
}

export default User;
