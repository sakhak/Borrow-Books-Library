import React from "react";
import CrudPage from "../../../components/crud/CrudPage";
import { STATUS_OPTIONS } from "../../../utils/helpers";

const columns = [
  { key: "image", label: "Photo", type: "image" },
  { key: "full_name", label: "Name" },
  { key: "phone", label: "Phone" },
  { key: "date_of_birth", label: "Date of Birth" },
  { key: "hire_date", label: "Hire Date" },
  { key: "salary", label: "Salary", type: "money" },
  { key: "status", label: "Status", type: "status" },
];

const fields = [
  { name: "first_name", label: "First Name", required: true },
  { name: "last_name", label: "Last Name", required: true },
  { name: "phone", label: "Phone", required: true },
  { name: "date_of_birth", label: "Date of Birth", type: "date", required: true },
  { name: "salary", label: "Salary ($)", type: "number", step: "0.01", min: 0, max: 99999.99, required: true },
  { name: "hire_date", label: "Hire Date", type: "date", required: true },
  { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, required: true, default: 1 },
  { name: "image", label: "Photo", type: "file" },
];

function Employees() {
  return (
    <CrudPage
      title="Employees"
      singular="Employee"
      urls={{
        list: "/getemployee",
        create: "/createemployee",
        update: (id) => `/updateemployees/${id}`,
        remove: (id) => `/deleteemployee/${id}`,
      }}
      idKey="employee_id"
      columns={columns}
      fields={fields}
      transform={(v) => ({ ...v, full_name: `${v.first_name} ${v.last_name}`.trim() })}
      searchPlaceholder="Search name or phone"
    />
  );
}

export default Employees;
