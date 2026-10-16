import React from "react";
import CrudPage from "../../../components/crud/CrudPage";
import { STATUS_OPTIONS } from "../../../utils/helpers";

const columns = [
  { key: "member_code", label: "Code" },
  { key: "full_name", label: "Name" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "joined_date", label: "Joined" },
  { key: "active_loans", label: "Active Loans" },
  { key: "status", label: "Status", type: "status" },
];

const fields = [
  { name: "full_name", label: "Full Name", required: true },
  { name: "phone", label: "Phone", required: true },
  { name: "email", label: "Email", type: "email" },
  { name: "joined_date", label: "Joined Date", type: "date" },
  { name: "address", label: "Address", full: true },
  { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS, required: true, default: 1 },
];

function Member() {
  return (
    <CrudPage
      title="Members"
      singular="Member"
      endpoint="/members"
      idKey="member_id"
      columns={columns}
      fields={fields}
      searchPlaceholder="Search name, code, phone or email"
    />
  );
}

export default Member;
