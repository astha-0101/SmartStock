// Charts drawn with plain HTML/CSS from real report data (no chart library).

export function CategoryChart({ categories }) {
  if (!categories || categories.length === 0) return <div className="empty">No products yet.</div>;
  const max = Math.max(...categories.map((c) => c.productCount), 1);
  return (
    <div>
      {categories.map((c) => (
        <div className="hbar-row" key={c.category}>
          <span className="hbar-label" title={c.category}>{c.category}</span>
          <div className="hbar-track"><div className="hbar-fill" style={{ width: (c.productCount / max) * 100 + "%" }} /></div>
          <span className="hbar-val">{c.productCount} items / {c.totalUnits} units</span>
        </div>
      ))}
    </div>
  );
}

export function MonthlyChart({ months }) {
  if (!months || months.length === 0) return <div className="empty">No data.</div>;
  const max = Math.max(...months.flatMap((m) => [m.additions, m.reductions, m.adjustments]), 1);
  const h = (v) => Math.max((v / max) * 120, v > 0 ? 3 : 0);
  const label = (m) => new Date(m + "-01T00:00:00").toLocaleString("en-IN", { month: "short" });
  return (
    <div>
      <div className="chart" style={{ height: "auto", gap: 12 }}>
        {months.map((m) => (
          <div className="bar-col" key={m.month}>
            <div className="bar-pair">
              <div className="bar add" title={"Added: " + m.additions} style={{ height: h(m.additions) }} />
              <div className="bar red" title={"Reduced: " + m.reductions} style={{ height: h(m.reductions) }} />
              <div className="bar" title={"Adjusted: " + m.adjustments} style={{ height: h(m.adjustments), background: "var(--primary)" }} />
            </div>
            <span className="bar-label">{label(m.month)}</span>
          </div>
        ))}
      </div>
      <div className="legend">
        <span><i style={{ background: "var(--green)" }} />Added</span>
        <span><i style={{ background: "var(--red)" }} />Reduced</span>
        <span><i style={{ background: "var(--primary)" }} />Adjusted</span>
      </div>
    </div>
  );
}
