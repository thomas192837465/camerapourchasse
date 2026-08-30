"use client";

import { MinusIcon, PlusIcon } from "./Icons";

export default function QtyStepper({ value, onChange, min = 1, max = 20 }) {
  return (
    <div className="qty-stepper">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} aria-label="Diminuer">
        <MinusIcon />
      </button>
      <span>{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} aria-label="Augmenter">
        <PlusIcon />
      </button>
    </div>
  );
}
