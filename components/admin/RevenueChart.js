"use client";

const DAYS = 14;

function dayKey(date) {
  return date.toISOString().slice(0, 10);
}

export default function RevenueChart({ orders }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = Array.from({ length: DAYS }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (DAYS - 1 - i));
    return d;
  });

  const totalsByDay = {};
  for (const o of orders) {
    if (o.status === "annulee") continue;
    const date = o.createdAt?.toDate ? o.createdAt.toDate() : o.createdAt ? new Date(o.createdAt) : null;
    if (!date) continue;
    const key = dayKey(date);
    totalsByDay[key] = (totalsByDay[key] || 0) + Number(o.total || 0);
  }

  const values = days.map((d) => totalsByDay[dayKey(d)] || 0);
  const max = Math.max(1, ...values);

  return (
    <div className="revenue-chart">
      {days.map((d, i) => (
        <div className="revenue-bar-col" key={dayKey(d)} title={`${d.toLocaleDateString("fr-FR")} — €${values[i].toFixed(2).replace(".", ",")}`}>
          <div className="revenue-bar" style={{ height: `${Math.max(3, (values[i] / max) * 100)}%` }} />
          <span className="revenue-bar-label">{d.getDate()}</span>
        </div>
      ))}
    </div>
  );
}
