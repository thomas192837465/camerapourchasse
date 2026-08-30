"use client";

import { useState } from "react";

export default function Tabs({ tabs }) {
  const [active, setActive] = useState(tabs[0]?.key);

  return (
    <div className="tabs">
      <div className="tab-list">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`tab-btn ${active === tab.key ? "active" : ""}`}
            onClick={() => setActive(tab.key)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div key={tab.key} className={`tab-panel ${active === tab.key ? "active" : ""}`}>
          {tab.content}
        </div>
      ))}
    </div>
  );
}
