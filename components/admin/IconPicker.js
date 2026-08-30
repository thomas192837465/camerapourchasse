"use client";

import { FA_ICON_KEYS } from "@/lib/icons-fa";
import FaIcon from "@/components/FaIcon";

export default function IconPicker({ value, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ width: 20, textAlign: "center", color: "var(--green-700)" }}>
        <FaIcon name={value} />
      </span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {FA_ICON_KEYS.map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
    </div>
  );
}
