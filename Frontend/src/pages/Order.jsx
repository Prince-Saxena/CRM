import { useEffect, useState } from "react";
import { useUser } from "../context/userContextProvider.jsx";
import { getAllOrder } from "../api/adminAPI.jsx";
import { getOrder } from "../api/dealerAPI.jsx";

// ─── Constants ────────────────────────────────────────────────────────────────
const AVATAR_COLORS = ["#2563eb", "#10b981", "#f59e0b", "#f43f5e", "#7c3aed", "#0ea5e9", "#ec4899"];

const REGIONS = ["north", "south", "east", "west"];

const REGION_COLORS = {
	north: { color: "#2563eb", bg: "#eff6ff" },
	south: { color: "#10b981", bg: "#f0fdf4" },
	east: { color: "#f59e0b", bg: "#fffbeb" },
	west: { color: "#7c3aed", bg: "#f5f3ff" },
};

const STATUS_MAP = {
	pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
	confirmed: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
	delivered: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
	cancelled: { bg: "bg-rose-50", text: "text-rose-600", dot: "bg-rose-400" },
	processing: { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500" },
};

const STATUS_LABELS = ["pending", "confirmed", "delivered", "cancelled"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
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
			className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0 ring-2 ring-white"
			style={{ background: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}
		>
			{initials}
		</div>
	);
}

function StatusBadge({ status }) {
	const s = STATUS_MAP[status?.toLowerCase()] ?? {
		bg: "bg-slate-100",
		text: "text-slate-500",
		dot: "bg-slate-400",
	};
	return (
		<span
			className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${s.bg} ${s.text}`}
		>
			<span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
			{status ?? "—"}
		</span>
	);
}

function MiniStat({ label, value, color, icon, prefix = "" }) {
	return (
		<div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
			<div
				className="w-9 h-9 rounded-xl flex items-center justify-center flexshrink-0"
				style={{ background: color + "18" }}
			>
				<span style={{ color }}>{icon}</span>
			</div>
			<div>
				<p className="text-xl font-bold text-gray-900 tracking-tight">
					{prefix}
					{typeof value === "number" ? value.toLocaleString("en-IN") : value}
				</p>
				<p className="text-xs text-slate-400">{label}</p>
			</div>
		</div>
	);
}

function Skeleton() {
	return (
		<div className="divide-y divide-slate-50">
			{[...Array(5)].map((_, i) => (
				<div key={i} className="grid grid-cols-12 gap-2 items-center px-5 py-3.5">
					<div className="col-span-4 flex items-center gap-2.5">
						<div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />
						<div className="space-y-1.5 flex-1">
							<div className="h-2.5 bg-slate-100 rounded animate-pulse w-3/4" />
							<div className="h-2 bg-slate-100 rounded animate-pulse w-1/2" />
						</div>
					</div>
					<div className="col-span-3">
						<div className="h-2.5 bg-slate-100 rounded animate-pulse w-2/3" />
					</div>
					<div className="col-span-2">
						<div className="h-5 bg-slate-100 rounded-full animate-pulse w-16" />
					</div>
					<div className="col-span-3">
						<div className="h-2.5 bg-slate-100 rounded animate-pulse w-3/4" />
					</div>
				</div>
			))}
		</div>
	);
}

function EmptyState() {
	return (
		<div className="flex flex-col items-center justify-center py-14 text-slate-400">
			<svg
				width="36"
				height="36"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="mb-3 opacity-40"
			>
				<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
				<line x1="3" y1="6" x2="21" y2="6" />
				<path d="M16 10a4 4 0 0 1-8 0" />
			</svg>
			<p className="text-sm font-medium text-slate-500">No orders found</p>
			<p className="text-xs mt-1">New orders will appear here</p>
		</div>
	);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Orders() {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState("all");
	const {user} = useUser();

	useEffect(() => {
		(async () => {
			try {
				if (user.role === "admin") {
					const res = await getAllOrder();
					setData(res.data.data);
				} else if(user.role === "dealer") {
					const res = await getOrder();
					setData(res.data.data);
				}
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

const orders = data?.recentOrders || data?.orders || [];
	const visible = orders.filter((o) => {
		const q = search.toLowerCase();
		const matchSearch =
			!search ||
			o.product?.toLowerCase().includes(q) ||
			o.area?.toLowerCase().includes(q) ||
			o.status?.toLowerCase().includes(q);
		const matchFilter = filter === "all" || o.status?.toLowerCase() === filter;
		return matchSearch && matchFilter;
	});

	// status breakdown counts
	const statusCounts = STATUS_LABELS.reduce((acc, s) => {
		acc[s] = orders.filter((o) => o.status?.toLowerCase() === s).length;
		return acc;
	}, {});

	return (
		<div className="min-h-screen bg-[#f8fafc] p-4 md:p-6 lg:p-8 space-y-5">
			{/* ── Page header ─────────────────────────────────── */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
				<div>
					<p className="text-xs font-medium text-blue-600 uppercase tracking-widest mb-0.5">
						Sales
					</p>
					<h1 className="text-2xl font-bold text-gray-900 tracking-tight">Orders</h1>
					<p className="text-sm text-slate-400 mt-0.5">
						Track and manage all customer orders
					</p>
				</div>
				<button className="self-start sm:self-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors">
					Export Orders
				</button>
			</div>

			{/* ── Stat cards ──────────────────────────────────── */}
			{!loading && data && user.role === "admin" && (
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<MiniStat
						label="Total Orders"
						value={data.totalOrders}
						color="#2563eb"
						icon={
							<svg
								width="16"
								height="16"
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
					<MiniStat
						label="Pending Orders"
						value={statusCounts.pending}
						color="#f59e0b"
						icon={
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<circle cx="12" cy="12" r="10" />
								<polyline points="12 6 12 12 16 14" />
							</svg>
						}
					/>
					<MiniStat
						label="Revenue (North)"
						value={data.regionStats?.north?.totalRevenue ?? 0}
						color="#10b981"
						prefix="₹"
						icon={
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<line x1="12" y1="1" x2="12" y2="23" />
								<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
							</svg>
						}
					/>
					<MiniStat
						label="Revenue (South)"
						value={data.regionStats?.south?.totalRevenue ?? 0}
						color="#7c3aed"
						prefix="₹"
						icon={
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
								<polyline points="17 6 23 6 23 12" />
							</svg>
						}
					/>
				</div>
			)}

			{/* ── Status breakdown ─────────────────────────────── */}
			{!loading && (
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{STATUS_LABELS.map((status) => {
						const s = STATUS_MAP[status];
						const count = statusCounts[status];
						const pct = orders.length ? Math.round((count / orders.length) * 100) : 0;
						return (
							<div
								key={status}
								className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4"
							>
								<div className="flex items-center justify-between mb-2">
									<span
										className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${s.bg} ${s.text}`}
									>
										<span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
										{status}
									</span>
									<span className="text-[11px] text-slate-400 font-medium">
										{pct}%
									</span>
								</div>
								<p className="text-2xl font-bold text-gray-900 tracking-tight">
									{count}
								</p>
								{/* progress bar */}
								<div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
									<div
										className={`h-full rounded-full ${s.dot}`}
										style={{ width: `${pct}%`, transition: "width 0.6s ease" }}
									/>
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/* ── Region performance ───────────────────────────── */}
			{!loading && data?.regionStats && (
				<div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
					<div className="px-5 py-4 border-b border-slate-100">
						<h2 className="text-sm font-bold text-gray-900 tracking-tight">
							Area Performance
						</h2>
						<p className="text-xs text-slate-400 mt-0.5">
							Orders and revenue by region
						</p>
					</div>
					<div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
						{REGIONS.map((area) => {
							const stat = data.regionStats[area] ?? {};
							const { color, bg } = REGION_COLORS[area];
							const maxRevenue =
								Math.max(
									...REGIONS.map((r) => data.regionStats[r]?.totalRevenue ?? 0),
								) || 1;
							const barW = Math.round(((stat.totalRevenue ?? 0) / maxRevenue) * 100);
							return (
								<div
									key={area}
									className="rounded-xl border border-slate-100 p-4 hover:border-opacity-60 transition-all"
									style={{ borderColor: color + "30" }}
								>
									<div className="flex items-center gap-2 mb-3">
										<div
											className="w-7 h-7 rounded-lg flex items-center justify-center"
											style={{ background: bg }}
										>
											<svg
												width="13"
												height="13"
												viewBox="0 0 24 24"
												fill="none"
												stroke={color}
												strokeWidth="2.5"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
												<circle cx="12" cy="10" r="3" />
											</svg>
										</div>
										<span className="text-xs font-bold text-gray-700 capitalize">
											{area}
										</span>
									</div>
									<p className="text-xl font-bold text-gray-900">
										{stat.count ?? 0}
									</p>
									<p className="text-[11px] text-slate-400 mb-2">orders</p>
									<p className="text-xs font-semibold" style={{ color }}>
										₹{(stat.totalRevenue ?? 0).toLocaleString("en-IN")}
									</p>
									{/* relative bar */}
									<div className="mt-2 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
										<div
											className="h-full rounded-full transition-all duration-700"
											style={{ width: `${barW}%`, background: color }}
										/>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}

			{/* ── Orders table ─────────────────────────────────── */}
			<div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
				{/* Header */}
				<div className="px-5 pt-5 pb-4 border-b border-slate-100">
					<div className="flex items-center justify-between mb-4">
						<div>
							<h2 className="text-sm font-bold text-gray-900 tracking-tight">
								Recent Orders
							</h2>
							<p className="text-xs text-slate-400 mt-0.5">
								{orders.length} total · {visible.length} shown
							</p>
						</div>
						<a
							href="/orders"
							className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
						>
							View all
							<svg
								width="12"
								height="12"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<polyline points="9 18 15 12 9 6" />
							</svg>
						</a>
					</div>

					{/* Search */}
					<div className="relative mb-3">
						<svg
							className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
							width="13"
							height="13"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<circle cx="11" cy="11" r="8" />
							<line x1="21" y1="21" x2="16.65" y2="16.65" />
						</svg>
						<input
							type="text"
							placeholder="Search by product, area, status…"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all placeholder:text-slate-400"
						/>
					</div>

					{/* Filter pills */}
					<div className="flex gap-1.5 flex-wrap">
						{["all", ...STATUS_LABELS].map((f) => (
							<button
								key={f}
								onClick={() => setFilter(f)}
								className={`text-[11px] font-semibold px-3 py-1 rounded-full capitalize transition-colors ${
									filter === f
										? "bg-blue-600 text-white"
										: "bg-slate-100 text-slate-500 hover:bg-slate-200"
								}`}
							>
								{f}
							</button>
						))}
					</div>
				</div>

				{/* Table head */}
				{!loading && visible.length > 0 && (
					<div className="grid grid-cols-12 gap-2 px-5 py-2 bg-slate-50 border-b border-slate-100">
						{[
							["Order ID", "col-span-2"],
							["Product", "col-span-3"],
							["Area", "col-span-2"],
							["Amount", "col-span-2"],
							["Status", "col-span-3"],
						].map(([h, span]) => (
							<p
								key={h}
								className={`text-[10px] font-semibold text-slate-400 uppercase tracking-wider ${span}`}
							>
								{h}
							</p>
						))}
					</div>
				)}

				{/* Rows */}
				{loading ? (
					<Skeleton />
				) : visible.length === 0 ? (
					<EmptyState />
				) : (
					<div className="divide-y divide-slate-50">
						{visible.map((order, i) => (
							<div
								key={order._id}
								className="grid grid-cols-12 gap-2 items-center px-5 py-3.5 hover:bg-slate-50/70 transition-colors"
							>
								{/* Order ID */}
								<div className="col-span-2">
									<span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
										#{order._id?.slice(-6).toUpperCase()}
									</span>
								</div>

								{/* Product */}
								<div className="col-span-3 flex items-center gap-2.5 min-w-0">
									<Avatar name={order.product} idx={i} />
									<p className="text-xs font-semibold text-gray-800 truncate">
										{order.product ?? "—"}
									</p>
								</div>

								{/* Area */}
								<div className="col-span-2 min-w-0">
									<div className="flex items-center gap-1">
										<svg
											width="10"
											height="10"
											viewBox="0 0 24 24"
											fill="none"
											stroke="#94a3b8"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
											<circle cx="12" cy="10" r="3" />
										</svg>
										<p className="text-[11px] text-slate-500 truncate capitalize">
											{order.area ?? "—"}
										</p>
									</div>
								</div>

								{/* Amount */}
								<div className="col-span-2">
									<p className="text-xs font-bold text-gray-800">
										₹{(order.totalAmount ?? 0).toLocaleString("en-IN")}
									</p>
								</div>

								{/* Status */}
								<div className="col-span-3">
									<StatusBadge status={order.status} />
								</div>
							</div>
						))}
					</div>
				)}

				{/* Footer */}
				{!loading && visible.length > 0 && (
					<div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
						<p className="text-[11px] text-slate-400">
							Showing{" "}
							<span className="font-semibold text-slate-600">{visible.length}</span>{" "}
							of <span className="font-semibold text-slate-600">{orders.length}</span>{" "}
							orders
						</p>
						<div className="flex items-center gap-3">
							<div className="flex items-center gap-1.5">
								<span className="w-2 h-2 rounded-full bg-emerald-400" />
								<span className="text-[11px] text-slate-400">
									{statusCounts.delivered} delivered
								</span>
							</div>
							<div className="flex items-center gap-1.5">
								<span className="w-2 h-2 rounded-full bg-amber-400" />
								<span className="text-[11px] text-slate-400">
									{statusCounts.pending} pending
								</span>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
