import config from "./config";

/** Turn an axios error into a readable message (Laravel validation, 409 conflicts, network errors). */
export const getErrorMessage = (error) => {
  const data = error?.response?.data;
  if (data?.errors) {
    const first = Object.values(data.errors).flat()[0];
    if (first) return first;
  }
  if (data?.message) return data.message;
  if (data?.error) return data.error;
  if (error?.code === "ERR_NETWORK") return "Cannot reach the server. Is the backend running?";
  return error?.message || "Something went wrong";
};

/** { field: ["msg"] } from a Laravel 422 response, else {} */
export const getFieldErrors = (error) => {
  const errors = error?.response?.data?.errors || {};
  return Object.fromEntries(Object.entries(errors).map(([k, v]) => [k, v[0]]));
};

export const fileUrl = (path) => (path ? config.image_url + path : "");

export const getPath = (obj, path) =>
  path.split(".").reduce((o, k) => (o === undefined || o === null ? undefined : o[k]), obj);

export const isActive = (v) => v === true || Number(v) === 1;

export const money = (v) => `$${Number(v || 0).toFixed(2)}`;

export const todayPlus = (days = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

export const STATUS_OPTIONS = [
  { value: 1, label: "Active" },
  { value: 0, label: "Inactive" },
];
