import { useEffect, useState } from "react";
import {
	AreaChart,
	Area,
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from "recharts";
import DashboardSkeleton from "../utils/Skeleton.jsx";
import StatCard from "../components/StatCard.jsx";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/userContextProvider.jsx";
import { getAdminDashboardData } from "../api/adminAPI.jsx";
import { getDealerDashboardData } from "../api/dealerAPI.jsx";

// ─── Colour tokens ────────────────────────────────────────────────────────────
const C = {
	blue: "#2563eb",
	blueSoft: "#eff6ff",
	sky: "#0ea5e9",
	emerald: "#10b981",
	amber: "#f59e0b",
	rose: "#f43f5e",
	violet: "#7c3aed",
	slate: "#64748b",
};

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle, action }) {
	return (
		<div className="flex items-center justify-between mb-4">
			<div>
				<h2 className="text-sm font-semibold text-gray-800">{title}</h2>
				{subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
			</div>
			{action}
		</div>
	);
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
	if (!active || !payload?.length) return null;
	return (
		<div className="bg-white border border-slate-100 rounded-xl shadow-lg p-3 text-xs">
			<p className="font-semibold text-gray-700 mb-1">{label}</p>
			{payload.map((p) => (
				<p key={p.name} style={{ color: p.color }} className="flex gap-2">
					<span className="text-slate-500">{p.name}:</span>
					<span className="font-semibold">{p.value}</span>
				</p>
			))}
		</div>
	);
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function Badge({ status }) {
	const map = {
		verified: "bg-emerald-50 text-emerald-700",
		unverified: "bg-amber-50 text-amber-700",
		assigned: "bg-blue-50 text-blue-700",
		pending: "bg-slate-100 text-slate-600",
		completed: "bg-emerald-50 text-emerald-700",
		cancelled: "bg-rose-50 text-rose-600",
		processing: "bg-violet-50 text-violet-700",
	};
	return (
		<span
			className={`text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${map[status?.toLowerCase()] ?? "bg-slate-100 text-slate-500"}`}
		>
			{status}
		</span>
	);
}

// ─── Avatar initials ──────────────────────────────────────────────────────────
const AVATAR_COLORS = ["#2563eb", "#10b981", "#f59e0b", "#f43f5e", "#7c3aed", "#0ea5e9"];
function Avatar({ name, idx = 0 }) {
	const initials =
		name
			?.split(" ")
			.map((w) => w[0])
			.join("")
			.slice(0, 2)
			.toUpperCase() ?? "??";
	return (
		<div
			className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
			style={{ background: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}
		>
			{initials}
		</div>
	);
}

// ─── Lead status donut data builder ──────────────────────────────────────────
function buildDonut(data) {
	return [
		{ name: "Verified", value: data?.verifiedLeads ?? 0, color: C.emerald },
		{ name: "Unverified", value: data?.unverifiedLeads ?? 0, color: C.amber },
		{ name: "Assigned", value: data?.assignedLeads ?? 0, color: C.blue },
	];
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
	const [loading, setLoading] = useState(true);
	const { user, data, setData } = useUser();
	const [tab, setTab] = useState("leads"); // "leads" | "orders"
	if (!user) {
		return <Navigate to="/login" />;
	}

	useEffect(() => {
		// console.log("TOKEN:", localStorage.getItem("token"));
		// console.log("TOKEN:", user);

		(async () => {
			try {
				const res =
					user.role === "admin"
						? await getAdminDashboardData()
						: await getDealerDashboardData();

				// console.log("Dashboard data →", res);
				setData(res.data.data);
				// console.log(res.data.data.recentOrders[0]._id);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		})();
	}, [user]);

	const DEALER_BAR = [
		{
			name: "North",
			deals: data?.regionStats?.north?.count || 0,
			revenue: data?.regionStats?.north?.totalRevenue / 10000 || 0,
		},
		{
			name: "South",
			deals: data?.regionStats?.south?.count || 0,
			revenue: data?.regionStats?.south?.totalRevenue / 10000 || 0,
		},
		{
			name: "East",
			deals: data?.regionStats?.east?.count || 0,
			revenue: data?.regionStats?.east?.totalRevenue / 10000 || 0,
		},
		{
			name: "West",
			deals: data?.regionStats?.west?.count || 0,
			revenue: data?.regionStats?.west?.totalRevenue / 10000 || 0,
		},
	];

	if (loading) return <DashboardSkeleton />;

	const totalLeads = data?.totalLeads ?? 0;

	return (
		<div className="min-h-screen bg-[#f8fafc] flex  font-sans">
			{/* ── Top bar ─────────────────────────────────────── */}
			<div className="flex-1 p-5 overflow-y-auto">
				<div className="flex  flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
					<div>
						<p className="text-xs font-medium text-blue-600 uppercase tracking-widest mb-0.5">
							{user.role === "admin" ? `Admin` : `Dealer`} Panel
						</p>
						<h1 className="text-2xl font-bold text-gray-900 tracking-tight">
							Analytics Dashboard
						</h1>
						<p className="text-sm text-slate-400 mt-0.5">
							{new Date().toLocaleDateString("en-IN", {
								weekday: "long",
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</p>
					</div>
					<div className="flex items-center gap-2">
						<span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-100">
							<span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
							Live
						</span>
						<button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors">
							Export Report
						</button>
					</div>
				</div>

				{/* ── Stat cards row 1 ────────────────────────────── */}
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
					<>
						<StatCard
							title={user.role === "admin" ? "Total Users" : "Total Sales"}
							value={user.role === "admin" ? data.totalUsers : data.totalSales}
							change={12}
							changeLabel="vs last month"
							color={C.blue}
							icon={
								user.role === "admin" ? (
									// 👤 Users Icon
									<svg
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
										<circle cx="9" cy="7" r="4" />
										<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
									</svg>
								) : (
									// 💰 Sales Icon
									<svg
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										<line x1="12" y1="1" x2="12" y2="23" />
										<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" />
									</svg>
								)
							}
						/>

						<StatCard
							title={user.role === "admin" ? "Total Dealers" : "Avg Sales"}
							value={
								user.role === "admin" ? data.totalDealers : data.avgSalesPerCustomer
							}
							change={5}
							changeLabel="vs last month"
							color={C.violet}
							icon={
								user.role === "admin" ? (
									// 🏢 Dealers Icon
									<svg
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										<rect x="2" y="7" width="20" height="14" rx="2" />
										<path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
									</svg>
								) : (
									// 📊 Avg Icon
									<svg
										width="18"
										height="18"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										<line x1="18" y1="20" x2="18" y2="10" />
										<line x1="12" y1="20" x2="12" y2="4" />
										<line x1="6" y1="20" x2="6" y2="14" />
									</svg>
								)
							}
						/>
					</>

					<StatCard
						title="Total Leads"
						value={data.totalLeads}
						change={18}
						changeLabel="vs last month"
						color={C.emerald}
						icon={
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
							</svg>
						}
					/>
					<StatCard
						title="Total Orders"
						value={data.totalOrders}
						change={-3}
						changeLabel="vs last month"
						color={C.amber}
						icon={
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
								<line x1="3" y1="6" x2="21" y2="6" />
								<path d="M16 10a4 4 0 0 1-8 0" />
							</svg>
						}
					/>
				</div>

				{/* ── Stat cards row 2 (lead breakdown) ────────────── */}
				<div className="grid grid-cols-4 gap-4 mb-6">
					<StatCard
						title="Converted Leads"
						value={data.convertedLeads}
						change={22}
						color={C.emerald}
						suffix=""
						icon={
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
								<polyline points="22 4 12 14.01 9 11.01" />
							</svg>
						}
					/>
					<StatCard
						title="Pending Leads"
						value={data.pendingLeads}
						change={-8}
						color={C.amber}
						icon={
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<circle cx="12" cy="12" r="10" />
								<line x1="12" y1="8" x2="12" y2="12" />
								<line x1="12" y1="16" x2="12.01" y2="16" />
							</svg>
						}
					/>
					<StatCard
						title="Assigned Leads"
						value={data.assignedLeads}
						change={14}
						color={C.sky}
						icon={
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
								<circle cx="9" cy="7" r="4" />
								<polyline points="16 11 18 13 22 9" />
							</svg>
						}
					/>
					<StatCard
						title="Lost Leads"
						value={data.lostLeads}
						change={14}
						color={C.sky}
						icon={
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
								<circle cx="9" cy="7" r="4" />
								<line x1="18" y1="8" x2="22" y2="12" />
								<line x1="22" y1="8" x2="18" y2="12" />
							</svg>
						}
					/>
				</div>

				{/* ── Bar chart — dealer performance ───────────────── */}
				{user.role === "admin" && (
					<div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
						<SectionHeader
							title="Dealer Performance"
							subtitle="Deals closed by region"
						/>
						<ResponsiveContainer width="100%" height={180}>
							<BarChart
								data={DEALER_BAR}
								margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
								barSize={22}
							>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="#f1f5f9"
									vertical={false}
								/>
								<XAxis
									dataKey="name"
									tick={{ fontSize: 11, fill: "#94a3b8" }}
									axisLine={false}
									tickLine={false}
								/>
								<YAxis
									tick={{ fontSize: 11, fill: "#94a3b8" }}
									axisLine={false}
									tickLine={false}
								/>
								<Tooltip content={<ChartTooltip />} />
								<Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
								<Bar
									dataKey="deals"
									name="Number of Deals Closed"
									fill={C.blue}
									radius={[4, 4, 0, 0]}
								/>
								<Bar
									dataKey="revenue"
									name="Revenue in (₹k)"
									fill={C.sky}
									radius={[4, 4, 0, 0]}
									opacity={0.7}
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
				)}

				{/* ── Tables row ───────────────────────────────────── */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
					{/* Recent Leads */}
					<div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
						<SectionHeader
							title="Recent Leads"
							subtitle={`${data.recentLeads?.length ?? 0} new entries`}
							action={
								<a
									href="/leads"
									className="text-xs text-blue-600 hover:underline font-medium"
								>
									View all →
								</a>
							}
						/>
						<div className="overflow-x-auto">
							<table className="w-full text-xs">
								<thead>
									<tr className="border-b border-slate-100">
										{["Name", "Email", "Status", "Date"].map((h) => (
											<th
												key={h}
												className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide pb-2 pr-3 last:pr-0"
											>
												{h}
											</th>
										))}
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-50">
									{(data.recentLeads ?? []).map((lead, i) => (
										<tr
											key={lead._id ?? i}
											className="hover:bg-slate-50/60 transition-colors"
										>
											<td className="py-2.5 pr-3">
												<div className="flex items-center gap-2">
													<Avatar name={lead.name} idx={i} />
													<span className="font-medium text-gray-800 truncate max-w-22.5">
														{lead.name}
													</span>
												</div>
											</td>
											<td className="py-2.5 pr-3 text-slate-500 truncate max-w-30">
												{lead.email}
											</td>
											<td className="py-2.5 pr-3">
												<Badge status={lead.status} />
											</td>
											<td className="py-2.5 text-slate-400">
												{lead.createdAt
													? new Date(lead.createdAt).toLocaleDateString(
															"en-IN",
															{ day: "2-digit", month: "short" },
														)
													: "—"}
											</td>
										</tr>
									))}
									{(!data.recentLeads || data.recentLeads.length === 0) && (
										<tr>
											<td
												colSpan={4}
												className="text-center py-8 text-slate-400"
											>
												No leads found
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>

					{/* Recent Orders */}
					<div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
						<SectionHeader
							title="Recent Orders"
							subtitle={`${data.recentOrders?.length ?? 0} latest orders`}
							action={
								<a
									href="/orders"
									className="text-xs text-blue-600 hover:underline font-medium"
								>
									View all →
								</a>
							}
						/>
						<div className="overflow-x-auto">
							<table className="w-full text-xs">
								<thead>
									<tr className="border-b border-slate-100">
										{["Order", "Customer", "Amount", "Status"].map((h) => (
											<th
												key={h}
												className="text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide pb-2 pr-3 last:pr-0"
											>
												{h}
											</th>
										))}
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-50">
									{(data.recentOrders ?? []).map((order, i) => (
										<tr
											key={order._id ?? i}
											className="hover:bg-slate-50/60 transition-colors"
										>
											<td className="py-2.5 pr-3 font-mono text-slate-600 text-[11px]">
												#{order._id.toString().toUpperCase()}
											</td>
											<td className="py-2.5 pr-3">
												<div className="flex items-center gap-2">
													<div className="capitalize ">
														{order.product}
													</div>
													{/* <span className="font-medium text-gray-800 truncate max-w-20">
														{order.customerName ??
															order.customer ??
															"—"}
													</span> */}
												</div>
											</td>
											<td className="py-2.5 pr-3 font-semibold text-gray-800">
												₹
												{(
													order.totalAmount ??
													order.total ??
													0
												).toLocaleString("en-IN")}
											</td>
											<td className="py-2.5">
												<Badge status={order.status} />
											</td>
										</tr>
									))}
									{(!data.recentOrders || data.recentOrders.length === 0) && (
										<tr>
											<td
												colSpan={4}
												className="text-center py-8 text-slate-400"
											>
												No orders found
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>
				</div>

				{/* Footer */}
				<p className="text-center text-xs text-slate-300 mt-8">
					CRMflow Admin · Data refreshes on page load
				</p>
			</div>
		</div>
	);
}
