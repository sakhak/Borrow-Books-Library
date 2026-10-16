import React, { useEffect } from "react";

function Notice({ notice, onClear }) {
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(onClear, 5000);
    return () => clearTimeout(t);
  }, [notice, onClear]);

  if (!notice) return null;
  const color =
    notice.type === "error"
      ? "bg-red-100 text-red-700 border-red-300"
      : "bg-green-100 text-green-700 border-green-300";
  return (
    <div className={`mx-5 mt-4 px-4 py-2 border rounded ${color}`} role="alert">
      {notice.text}
    </div>
  );
}

export default Notice;
