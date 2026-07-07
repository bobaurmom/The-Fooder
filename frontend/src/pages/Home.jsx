import "./Home.css";
import { salesData, statsData } from "../services/api";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

export default function Home() {
  return (
    <div>
      {/* Top row: charts */}
      <div className="home-top">

        {/* Sales Performance */}
        <div className="card">
          <p className="card-title">Sales performance</p>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#86efac" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#86efac" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v / 1000}k`} />
              <Tooltip formatter={v => [`$${Number(v).toLocaleString()}`, "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} fill="url(#salesGrad)" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="chart-legend">
            <span className="legend-dot" style={{ background: "#86efac" }} />
            Monthly revenue trend
          </div>
        </div>

        {/* Statistics */}
        <div className="card">
          <p className="card-title">Statistics</p>
          <div className="stats-top-row">
            <span className="badge-green">↑ +12%</span>
            <div className="ready-box">
              <div className="ready-label">Ready</div>
              <div className="ready-num">0</div>
              <div className="ready-sub">packages</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={statsData} barSize={8} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="burgers" fill="#f87171" radius={[3, 3, 0, 0]} />
              <Bar dataKey="pizza"   fill="#60a5fa" radius={[3, 3, 0, 0]} />
              <Bar dataKey="drinks"  fill="#34d399" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Bottom row: stat cards */}
      <div className="home-bottom">

        <div className="card">
          <p className="card-title">Monthly Sales</p>
          <div className="stat-rows">
            <div className="stat-row"><span>Total revenue:</span>        <span className="val">$49,200</span></div>
            <div className="stat-row"><span>Orders processed:</span>     <span className="val">1,240</span></div>
            <div className="stat-row"><span>Growth vs last month:</span> <span className="val green">+12%</span></div>
          </div>
          <div className="stat-footer">
            <span className="stat-icon">📈</span>
            Best month so far this year
          </div>
        </div>

        <div className="card">
          <p className="card-title">Total Food</p>
          <div className="stat-rows">
            <div className="stat-row"><span>Active Food:</span>    <span className="val">325</span></div>
            <div className="stat-row"><span>Out of stock:</span>   <span className="val orange">18</span></div>
            <div className="stat-row"><span>New this month:</span> <span className="val">12</span></div>
          </div>
          <div className="stat-footer">
            <span className="stat-icon">📦</span>
            18 items need restocking
          </div>
        </div>

        <div className="card">
          <p className="card-title">Total Orders</p>
          <div className="stat-rows">
            <div className="stat-row"><span>Completed:</span> <span className="val green">1,180</span></div>
            <div className="stat-row"><span>Pending:</span>   <span className="val orange">42</span></div>
            <div className="stat-row"><span>Cancelled:</span> <span className="val red">18</span></div>
          </div>
          <div className="stat-footer">
            <span className="stat-icon">🛍️</span>
            42 orders awaiting fulfillment
          </div>
        </div>

      </div>
    </div>
  );
}
