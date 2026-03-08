import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";

const API_BASE = "https://script.google.com/macros/s/AKfycbyhu-NUIvQICkRq27fWBLL0ZtXHBDmqkKmE-2HO7yuXrkmcIr9lU6li2pqwx-flQumu/exec";

const COLORS = ["#6366f1", "#22d3ee", "#f59e0b", "#10b981", "#f43f5e", "#a78bfa"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function KPICard({ label, value, prefix = "$", highlight = false }) {
  return (
    <div style={{
      background: highlight ? "#6366f1" : "#1e1e2e",
      borderRadius: 12,
      padding: "16px",
      flex: 1,
      minWidth: 140,
    }}>
      <div style={{ color: highlight ? "#c7d2fe" : "#94a3b8", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      <div style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginTop: 6 }}>
        {prefix}{typeof value === "number" ? value.toLocaleString() : value}
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{ color: "#94a3b8", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, margin: "24px 0 12px" }}>
      {children}
    </div>
  );
}

function MonthlyTab({ data }) {
  if (!data) return null;
  const { kpis, byClient, byCourse, byWeek, cancelled, dailyNetGain } = data;

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <KPICard label="Projected" value={kpis.projectedEarnings} highlight />
        <KPICard label="Lost" value={kpis.lostEarnings} />
        <KPICard label="Unpaid" value={kpis.unpaidEarnings} />
        <KPICard label="Hours" value={kpis.totalHours} prefix="" />
        <KPICard label="Classes" value={kpis.totalClasses} prefix="" />
      </div>

      <SectionTitle>Earnings by Client</SectionTitle>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={byClient} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2e2e3e" />
          <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <Tooltip contentStyle={{ background: "#1e1e2e", border: "none", borderRadius: 8 }} />
          <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <SectionTitle>Earnings by Course</SectionTitle>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={byCourse} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2e2e3e" />
          <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <Tooltip contentStyle={{ background: "#1e1e2e", border: "none", borderRadius: 8 }} />
          <Bar dataKey="revenue" fill="#22d3ee" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <SectionTitle>Weekly Load</SectionTitle>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={byWeek} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2e2e3e" />
          <XAxis dataKey="week" tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <Tooltip contentStyle={{ background: "#1e1e2e", border: "none", borderRadius: 8 }} />
          <Bar dataKey="revenue" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <SectionTitle>Daily Net Gain / Loss</SectionTitle>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={dailyNetGain} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2e2e3e" />
          <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 9 }} tickFormatter={d => d.slice(5)} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <Tooltip contentStyle={{ background: "#1e1e2e", border: "none", borderRadius: 8 }} />
          <Line type="monotone" dataKey="netGain" stroke="#10b981" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>

      {cancelled.length > 0 && (
        <>
          <SectionTitle>Cancelled Events</SectionTitle>
          <div style={{ background: "#1e1e2e", borderRadius: 12, overflow: "hidden" }}>
            {cancelled.map((c, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 16px",
                borderBottom: i < cancelled.length - 1 ? "1px solid #2e2e3e" : "none"
              }}>
                <div>
                  <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{c.client}</div>
                  <div style={{ color: "#94a3b8", fontSize: 11 }}>{c.course} · {c.hours}h</div>
                </div>
                <div style={{ color: "#f43f5e", fontWeight: 700 }}>-${c.lostRevenue}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function YTDTab({ data }) {
  if (!data) return null;
  const { kpis, byClient, byCourse, byMonth } = data;

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <KPICard label="YTD Earnings" value={kpis.projectedEarnings} highlight />
        <KPICard label="YTD Lost" value={kpis.lostEarnings} />
        <KPICard label="YTD Hours" value={kpis.totalHours} prefix="" />
        <KPICard label="YTD Classes" value={kpis.totalClasses} prefix="" />
      </div>

      <SectionTitle>Monthly Revenue Trend</SectionTitle>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={byMonth} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2e2e3e" />
          <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }}
            tickFormatter={m => MONTHS[parseInt(m.slice(4)) - 1]} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <Tooltip contentStyle={{ background: "#1e1e2e", border: "none", borderRadius: 8 }}
            labelFormatter={m => MONTHS[parseInt(m.slice(4)) - 1]} />
          <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} dot={{ fill: "#6366f1" }} />
        </LineChart>
      </ResponsiveContainer>

      <SectionTitle>YTD by Client</SectionTitle>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={byClient} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2e2e3e" />
          <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <Tooltip contentStyle={{ background: "#1e1e2e", border: "none", borderRadius: 8 }} />
          <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
            {byClient.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <SectionTitle>YTD by Course</SectionTitle>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={byCourse} dataKey="revenue" nameKey="name" cx="50%" cy="50%" outerRadius={80}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
            {byCourse.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={{ background: "#1e1e2e", border: "none", borderRadius: 8 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function App() {
  const now = new Date();
  const [tab, setTab] = useState("monthly");
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [monthlyData, setMonthlyData] = useState(null);
  const [ytdData, setYtdData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tab === "monthly") fetchMonthly();
    if (tab === "ytd") fetchYTD();
  }, [tab, month, year]);

  async function fetchMonthly() {
  setLoading(true);
  setError(null);
  try {
    const res = await fetch(`${API_BASE}?type=monthly&month=${month}&year=${year}`, {
      redirect: "follow",
      mode: "cors",
    });
    const json = await res.json();
    if (json.success) setMonthlyData(json.data);
    else setError(json.error);
  } catch (e) {
    setError(e.message);
  }
  setLoading(false);
}

async function fetchYTD() {
  setLoading(true);
  setError(null);
  try {
    const res = await fetch(`${API_BASE}?type=ytd&year=${year}`, {
      redirect: "follow",
      mode: "cors",
    });
    const json = await res.json();
    if (json.success) setYtdData(json.data);
    else setError(json.error);
  } catch (e) {
    setError(e.message);
  }
  setLoading(false);
}

  return (
    <div style={{
      background: "#0f0f1a",
      minHeight: "100vh",
      color: "#fff",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      maxWidth: 480,
      margin: "0 auto",
      padding: "24px 16px 48px",
    }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ color: "#6366f1", fontSize: 12, textTransform: "uppercase", letterSpacing: 2 }}>Freelance</div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>Dashboard</div>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 20 }}>
        <select value={month} onChange={e => setMonth(parseInt(e.target.value))}
          style={{ background: "#1e1e2e", color: "#fff", border: "1px solid #2e2e3e", borderRadius: 8, padding: "8px 12px", fontSize: 14 }}>
          {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
        <select value={year} onChange={e => setYear(parseInt(e.target.value))}
          style={{ background: "#1e1e2e", color: "#fff", border: "1px solid #2e2e3e", borderRadius: 8, padding: "8px 12px", fontSize: 14 }}>
          {[2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["monthly", "ytd"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: tab === t ? "#6366f1" : "#1e1e2e",
            color: "#fff", border: "none", borderRadius: 8,
            padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer"
          }}>
            {t === "monthly" ? "Monthly" : "YTD"}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: "center", color: "#94a3b8", marginTop: 60 }}>Loading...</div>
      )}
      {error && (
        <div style={{ textAlign: "center", color: "#f43f5e", marginTop: 20, fontSize: 13 }}>Error: {error}</div>
      )}
      {!loading && !error && (
        tab === "monthly"
          ? <MonthlyTab data={monthlyData} />
          : <YTDTab data={ytdData} />
      )}
    </div>
  );
}