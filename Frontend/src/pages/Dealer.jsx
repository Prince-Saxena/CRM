import { useEffect, useState } from "react";
import { getAllDealers,verifyDealer } from "../api/adminAPI.jsx";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const AVATAR_COLORS = ["#2563eb", "#10b981", "#f59e0b", "#f43f5e", "#7c3aed", "#0ea5e9", "#ec4899"];

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

function StatusBadge({ verified }) {
	return verified ? (
		<span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
			<span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
			Verified
		</span>
	) : (
		<span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
			<span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
			Pending
		</span>
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
						<div className="h-7 bg-slate-100 rounded-lg animate-pulse w-20" />
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
				<rect x="2" y="7" width="20" height="14" rx="2" />
				<path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
			</svg>
			<p className="text-sm font-medium text-slate-500">No dealers found</p>
			<p className="text-xs mt-1">Registered dealers will appear here</p>
		</div>
	);
}

// ─── Stat mini-card ───────────────────────────────────────────────────────────
function MiniStat({ label, value, color, icon }) {
	return (
		<div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
			<div
				className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
				style={{ background: color + "18" }}
			>
				<span style={{ color }}>{icon}</span>
			</div>
			<div>
				<p className="text-xl font-bold text-gray-900 tracking-tight">{value}</p>
				<p className="text-xs text-slate-400">{label}</p>
			</div>
		</div>
	);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Dealers() {
	const [dealers, setDealers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [processing, setProcessing] = useState(null);
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState("all"); // all | verified | pending

	useEffect(() => {
		(async () => {
			try {
				const res = await getAllDealers();
				setDealers(res.data.data);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const handleVerify = async (id) => {
		setProcessing(id);
		try {
			await verifyDealer(id);
			setDealers((prev) =>
				prev.map((d) => (d._id === id ? { ...d, status: "verified" } : d)),
			);
		} catch (err) {
			console.error(err);
		} finally {
			setProcessing(null);
		}
	};

	const verified = dealers.filter((d) => d.status === "verified");
	const unverified = dealers.filter((d) => d.status !== "verified");

	const visible = dealers.filter((d) => {
		const q = search.toLowerCase();
		const matchSearch =
			!search ||
			d.name?.toLowerCase().includes(q) ||
			d.email?.toLowerCase().includes(q) ||
			d.area?.toLowerCase().includes(q) ||
			d.city?.toLowerCase().includes(q);
		const matchFilter =
			filter === "all" ||
			(filter === "verified" && d.status === "verified") ||
			(filter === "pending" && d.status !== "verified");
		return matchSearch && matchFilter;
	});

	return (
		<div className="min-h-screen bg-[#f8fafc] p-4 md:p-6 lg:p-8 space-y-5">
			{/* ── Page header ─────────────────────────────────── */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
				<div>
					<p className="text-xs font-medium text-blue-600 uppercase tracking-widest mb-0.5">
						Management
					</p>
					<h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dealers</h1>
					<p className="text-sm text-slate-400 mt-0.5">
						Manage and verify your dealer network
					</p>
				</div>
				<button className="self-start sm:self-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors">
					+ Add Dealer
				</button>
			</div>

			{/* ── Stat cards ──────────────────────────────────── */}
			<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
				<MiniStat
					label="Total Dealers"
					value={dealers.length}
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
							<rect x="2" y="7" width="20" height="14" rx="2" />
							<path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
						</svg>
					}
				/>
				<MiniStat
					label="Verified"
					value={verified.length}
					color="#10b981"
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
							<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
							<polyline points="22 4 12 14.01 9 11.01" />
						</svg>
					}
				/>
				<MiniStat
					label="Pending Verification"
					value={unverified.length}
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
							<line x1="12" y1="8" x2="12" y2="12" />
							<line x1="12" y1="16" x2="12.01" y2="16" />
						</svg>
					}
				/>
			</div>

			{/* ── Dealer table card ────────────────────────────── */}
			<div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
				{/* Card header */}
				<div className="px-5 pt-5 pb-4 border-b border-slate-100">
					<div className="flex items-center justify-between mb-4">
						<div>
							<h2 className="text-sm font-bold text-gray-900 tracking-tight">
								All Dealers
							</h2>
							<p className="text-xs text-slate-400 mt-0.5">
								{dealers.length} total · {visible.length} shown
							</p>
						</div>
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
							placeholder="Search by name, email, area, city…"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all placeholder:text-slate-400"
						/>
					</div>

					{/* Filter pills */}
					<div className="flex gap-1.5">
						{["all", "verified", "pending"].map((f) => (
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
							["Dealer", "col-span-4"],
							["Location", "col-span-3"],
							["Status", "col-span-2"],
							["Action", "col-span-3"],
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
						{visible.map((dealer, i) => {
							const isVerified = dealer.status === "verified";
							const isSaving = processing === dealer._id;

							return (
								<div
									key={dealer._id}
									className="grid grid-cols-12 gap-2 items-center px-5 py-3.5 hover:bg-slate-50/70 transition-colors"
								>
									{/* Dealer info */}
									<div className="col-span-4 flex items-center gap-2.5 min-w-0">
										<Avatar name={dealer.name} idx={i} />
										<div className="min-w-0">
											<p className="text-xs font-semibold text-gray-800 truncate">
												{dealer.name}
											</p>
											<p className="text-[11px] text-slate-400 truncate">
												{dealer.email}
											</p>
										</div>
									</div>

									{/* Location */}
									<div className="col-span-3 min-w-0">
										<p className="text-xs font-medium text-gray-700 truncate">
											{dealer.city ?? "—"}
										</p>
										<div className="flex items-center gap-1 mt-0.5">
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
											<p className="text-[11px] text-slate-400 truncate">
												{dealer.area ?? "—"}
											</p>
										</div>
									</div>

									{/* Status */}
									<div className="col-span-2">
										<StatusBadge verified={isVerified} />
									</div>

									{/* Action */}
									<div className="col-span-3">
										{isSaving ? (
											<div className="flex items-center gap-1.5 text-[11px] text-blue-500">
												<svg
													className="animate-spin w-3 h-3"
													viewBox="0 0 24 24"
													fill="none"
												>
													<circle
														className="opacity-25"
														cx="12"
														cy="12"
														r="10"
														stroke="currentColor"
														strokeWidth="4"
													/>
													<path
														className="opacity-75"
														fill="currentColor"
														d="M4 12a8 8 0 018-8v8z"
													/>
												</svg>
												Verifying…
											</div>
										) : isVerified ? (
											<div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
												<svg
													width="13"
													height="13"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2.5"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
												</svg>
												Approved
											</div>
										) : (
											<button
												onClick={() => handleVerify(dealer._id)}
												disabled={isSaving}
												className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg transition-all"
											>
												<svg
													width="11"
													height="11"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2.5"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<polyline points="20 6 9 17 4 12" />
												</svg>
												Verify
											</button>
										)}
									</div>
								</div>
							);
						})}
					</div>
				)}

				{/* Footer */}
				{!loading && visible.length > 0 && (
					<div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
						<p className="text-[11px] text-slate-400">
							Showing{" "}
							<span className="font-semibold text-slate-600">{visible.length}</span>{" "}
							of{" "}
							<span className="font-semibold text-slate-600">{dealers.length}</span>{" "}
							dealers
						</p>
						<div className="flex items-center gap-3">
							<div className="flex items-center gap-1.5">
								<span className="w-2 h-2 rounded-full bg-emerald-400" />
								<span className="text-[11px] text-slate-400">
									{verified.length} verified
								</span>
							</div>
							<div className="flex items-center gap-1.5">
								<span className="w-2 h-2 rounded-full bg-amber-400" />
								<span className="text-[11px] text-slate-400">
									{unverified.length} pending
								</span>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* ── Verified dealer cards grid ───────────────────── */}
			{verified.length > 0 && (
				<div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
					<div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
						<div>
							<h2 className="text-sm font-bold text-gray-900 tracking-tight">
								Verified Network
							</h2>
							<p className="text-xs text-slate-400 mt-0.5">
								{verified.length} active dealers
							</p>
						</div>
					</div>

					<div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
						{verified.map((d, i) => (
							<div
								key={d._id}
								className="border border-slate-100 rounded-xl p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
							>
								<div className="flex items-start gap-3">
									<Avatar name={d.name} idx={i} />
									<div className="min-w-0 flex-1">
										<div className="flex items-center gap-2 flex-wrap">
											<p className="text-xs font-semibold text-gray-800 truncate">
												{d.name}
											</p>
											<svg
												width="12"
												height="12"
												viewBox="0 0 24 24"
												fill="#10b981"
												className="shrink-0"
											>
												<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
											</svg>
										</div>
										<p className="text-[11px] text-slate-400 truncate mt-0.5">
											{d.email}
										</p>
										<div className="flex items-center gap-1 mt-1.5">
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
											<p className="text-[11px] text-slate-500">
												{[d.area, d.city].filter(Boolean).join(", ") || "—"}
											</p>
										</div>
									</div>
								</div>
								<div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
									<span className="font-mono text-[10px] text-slate-300">
										ID: {d._id?.slice(-8).toUpperCase()}
									</span>
									<a
										href={`/dealers/${d._id}`}
										className="text-[11px] text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
									>
										View →
									</a>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
