"use client";

import { useEffect, useState } from "react";
import { getOpenStatus } from "@/lib/utils";

export default function StatusBadge({ hours }) {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setStatus(getOpenStatus(hours));
  }, [hours]);

  if (!status) {
    // Avoids a server/client mismatch flash before the client clock resolves
    return <span className="inline-block h-6 w-20" aria-hidden="true" />;
  }

  return (
    <span
      className={`stamp inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium uppercase tracking-wide border-2 rounded-stall ${
        status.isOpen
          ? "border-teal text-teal bg-teal/10"
          : "border-ink/30 text-ink/60 bg-ink/5"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${status.isOpen ? "bg-teal" : "bg-ink/40"}`}
      />
      {status.label}
    </span>
  );
}
