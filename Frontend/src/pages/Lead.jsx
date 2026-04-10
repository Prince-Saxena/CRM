import { useEffect, useState } from "react";
import { useUser } from "../context/userContextProvider.jsx";
import { getLeadsWithDealers, assignLeadToDealer, createLead } from "../api/adminAPI.jsx";
import { getLead } from "../api/dealerAPI.jsx";
import Toast from "../components/Toast.jsx";
// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_MAP = {
	verified: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
	unverified: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
	assigned: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
	pending: { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
	new: { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500" },
};

const AVATAR_COLORS = ["#2563eb", "#10b981", "#f59e0b", "#f43f5e", "#7c3aed", "#0ea5e9", "#ec4899"];

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
	const s = STATUS_MAP[status?.toLowerCase()] ?? STATUS_MAP.pending;
	return (
		<span
			className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${s.bg} ${s.text}`}
		>
			<span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
			{status ?? "—"}
		</span>
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
				<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
				<circle cx="9" cy="7" r="4" />
				<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
				<path d="M16 3.13a4 4 0 0 1 0 7.75" />
			</svg>
			<p className="text-sm font-medium text-slate-500">No leads found</p>
			<p className="text-xs mt-1">New leads will appear here</p>
		</div>
	);
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function RecentLeads() {
	const [toast, setToast] = useState(null);
	const [leads, setLeads] = useState([]);
	const [dealers, setDealers] = useState([]);
	const { user, setUser } = useUser();
	const [open, setOpen] = useState(false);

	useEffect(() => {
		(async () => {
			try {
				if (user.role === "admin") {
					const fetchData = await getLeadsWithDealers();
					// console.log(fetchData.data.data);
					setLeads(fetchData.data.data.leads);
					setDealers(fetchData.data.data.dealers);
				} else if (user.role === "dealer") {
					const fetchData = await getLead();
					console.log("Leads", fetchData.data);

					setLeads(fetchData.data.data);
				}
			} catch (err) {
				console.error(err);
			}
		})();
	}, []);

	const [assigning, setAssigning] = useState(null); // leadId being saved
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState("all");
	const [form, setForm] = useState({
		name: "",
		email: "",
		phone: "",
		product: "",
		quantity: 1,
		paymentMethod: "cod",
		area: "",
		message: "",
	});

	const [creating, setCreating] = useState(false);

	const handleAssign = async (leadId, dealerId) => {
		setAssigning(leadId);
		try {
			await assignLeadToDealer(leadId, dealerId);

			// ✅ update leads state
			const updatedLeads = leads.map((l) =>
				l._id === leadId ? { ...l, assignedDealer: dealerId, status: "assigned" } : l,
			);

			setLeads(updatedLeads);
		} finally {
			setAssigning(null);
		}
	};
	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleCreateLead = async (e) => {
		e.preventDefault();
		setCreating(true);

		try {
			console.log("Creating lead with data:", form);
			const res = await createLead(form);

			// add new lead to UI
			setLeads((prev) => [res.data.data, ...prev]);

			setToast({
				message: msg,
				type: "success",
			});
			// reset form
			setForm({
				name: "",
				email: "",
				phone: "",
				product: "",
				quantity: 1,
				paymentMethod: "cod",
				area: "",
				message: "",
			});
		} catch (err) {
			const msg = err.response?.data?.message || "Something went wrong";

			setToast({
				message: msg,
				type: "error",
			});
		} finally {
			setCreating(false);
		}
	};

	// filter + search
	const visible = leads.filter((l) => {
		const matchSearch =
			!search ||
			l.name?.toLowerCase().includes(search.toLowerCase()) ||
			l.email?.toLowerCase().includes(search.toLowerCase()) ||
			l.product?.toLowerCase().includes(search.toLowerCase()) ||
			l.area?.toLowerCase().includes(search.toLowerCase());
		const matchFilter = filter === "all" || l.status?.toLowerCase() === filter;
		return matchSearch && matchFilter;
	});

	const statuses = ["all", ...new Set(leads.map((l) => l.status?.toLowerCase()).filter(Boolean))];

	return (
		<div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
			{toast && (
				<Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
			)}
			{/* ── Create Lead ───────────────────────── */}

			<div
				className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-300 ${
					open ? "border-blue-200 shadow-blue-50" : "border-slate-100"
				}`}
			>
				{/* ── Toggle bar (always visible) ─────────────────── */}
				<button
					type="button"
					onClick={() => setOpen((p) => !p)}
					className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors group"
				>
					<div className="flex items-center gap-3">
						<div
							className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-200 ${
								open ? "bg-blue-600" : "bg-blue-50 group-hover:bg-blue-100"
							}`}
						>
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke={open ? "white" : "#2563eb"}
								strokeWidth="2.5"
								strokeLinecap="round"
								strokeLinejoin="round"
								style={{
									transform: open ? "rotate(45deg)" : "rotate(0deg)",
									transition: "transform 0.3s ease",
								}}
							>
								<line x1="12" y1="5" x2="12" y2="19" />
								<line x1="5" y1="12" x2="19" y2="12" />
							</svg>
						</div>
						<div className="text-left">
							<p className="text-sm font-bold text-gray-900 tracking-tight">
								Create New Lead
							</p>
							{!open && (
								<p className="text-xs text-slate-400 mt-0.5">
									Click to expand and fill lead details
								</p>
							)}
						</div>
					</div>

					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#94a3b8"
						strokeWidth="2.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						style={{
							transform: open ? "rotate(180deg)" : "rotate(0deg)",
							transition: "transform 0.3s ease",
							flexShrink: 0,
						}}
					>
						<polyline points="6 9 12 15 18 9" />
					</svg>
				</button>

				{/* ── Collapsible body ─────────────────────────────── */}
				<div
					style={{
						maxHeight: open ? "1000px" : "0px",
						opacity: open ? 1 : 0,
						transition: "max-height 0.35s ease, opacity 0.25s ease",
						overflow: "hidden",
					}}
				>
					<div className="border-t border-slate-100" />

					<form
						onSubmit={handleCreateLead}
						className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
					>
						{/* Name */}
						<div className="space-y-1.5">
							<label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
								Full Name <span className="text-rose-400">*</span>
							</label>
							<div className="relative">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
									<svg
										width="13"
										height="13"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
										<circle cx="12" cy="7" r="4" />
									</svg>
								</span>
								<input
									name="name"
									value={form.name}
									onChange={handleChange}
									placeholder="John Doe"
									required
									className="w-full pl-8 pr-3.5 py-2.5 text-sm text-gray-900 bg-slate-50 border border-slate-200 rounded-lg outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
								/>
							</div>
						</div>

						{/* Email */}
						<div className="space-y-1.5">
							<label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
								Email <span className="text-rose-400">*</span>
							</label>
							<div className="relative">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
									<svg
										width="13"
										height="13"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
										<polyline points="22,6 12,13 2,6" />
									</svg>
								</span>
								<input
									name="email"
									value={form.email}
									onChange={handleChange}
									type="email"
									placeholder="john@example.com"
									required
									className="w-full pl-8 pr-3.5 py-2.5 text-sm text-gray-900 bg-slate-50 border border-slate-200 rounded-lg outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
								/>
							</div>
						</div>

						{/* Phone */}
						<div className="space-y-1.5">
							<label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
								Phone <span className="text-rose-400">*</span>
							</label>
							<div className="relative">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
									<svg
										width="13"
										height="13"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
									</svg>
								</span>
								<input
									name="phone"
									value={form.phone}
									onChange={handleChange}
									placeholder="+91 XXXXX XXXXX"
									required
									className="w-full pl-8 pr-3.5 py-2.5 text-sm text-gray-900 bg-slate-50 border border-slate-200 rounded-lg outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
								/>
							</div>
						</div>

						{/* Product */}
						<div className="space-y-1.5">
							<label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
								Product <span className="text-rose-400">*</span>
							</label>
							<div className="relative">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
									<svg
										width="13"
										height="13"
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
								</span>
								<input
									name="product"
									value={form.product}
									onChange={handleChange}
									placeholder="e.g. Solar Panel"
									required
									className="w-full pl-8 pr-3.5 py-2.5 text-sm text-gray-900 bg-slate-50 border border-slate-200 rounded-lg outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
								/>
							</div>
						</div>

						{/* Quantity */}
						<div className="space-y-1.5">
							<label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
								Quantity
							</label>
							<div className="relative">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
									<svg
										width="13"
										height="13"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<line x1="8" y1="6" x2="21" y2="6" />
										<line x1="8" y1="12" x2="21" y2="12" />
										<line x1="8" y1="18" x2="21" y2="18" />
										<line x1="3" y1="6" x2="3.01" y2="6" />
										<line x1="3" y1="12" x2="3.01" y2="12" />
										<line x1="3" y1="18" x2="3.01" y2="18" />
									</svg>
								</span>
								<input
									type="number"
									name="quantity"
									value={form.quantity}
									onChange={handleChange}
									placeholder="1"
									min="1"
									className="w-full pl-8 pr-3.5 py-2.5 text-sm text-gray-900 bg-slate-50 border border-slate-200 rounded-lg outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
								/>
							</div>
						</div>

						{/* Payment Method */}
						<div className="space-y-1.5">
							<label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
								Payment Method
							</label>
							<div className="relative">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
									<svg
										width="13"
										height="13"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
										<line x1="1" y1="10" x2="23" y2="10" />
									</svg>
								</span>
								<select
									name="paymentMethod"
									value={form.paymentMethod}
									onChange={handleChange}
									className="w-full appearance-none pl-8 pr-8 py-2.5 text-sm text-gray-900 bg-slate-50 border border-slate-200 rounded-lg outline-none transition-all focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50 cursor-pointer"
								>
									<option value="cod">Cash on Delivery</option>
									<option value="online">Online Payment</option>
								</select>
								<span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
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
										<polyline points="6 9 12 15 18 9" />
									</svg>
								</span>
							</div>
						</div>

						{/* Area */}
						<div className="sm:col-span-2 space-y-1.5">
							<label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
								Area
							</label>
							<div className="relative">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
									<svg
										width="13"
										height="13"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
										<circle cx="12" cy="10" r="3" />
									</svg>
								</span>
								<input
									name="area"
									value={form.area}
									onChange={handleChange}
									placeholder="e.g. South Delhi, Sector 12"
									className="w-full pl-8 pr-3.5 py-2.5 text-sm text-gray-900 bg-slate-50 border border-slate-200 rounded-lg outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
								/>
							</div>
						</div>

						{/* Message */}
						<div className="sm:col-span-2 space-y-1.5">
							<label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
								Message
							</label>
							<textarea
								name="message"
								value={form.message}
								onChange={handleChange}
								placeholder="Any additional notes or requirements…"
								rows={3}
								className="w-full px-3.5 py-2.5 text-sm text-gray-900 bg-slate-50 border border-slate-200 rounded-lg outline-none transition-all resize-none placeholder:text-slate-400 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
							/>
						</div>

						{/* Divider */}
						<div className="sm:col-span-2 h-px bg-slate-100" />

						{/* Actions */}
						<div className="sm:col-span-2 flex items-center gap-3">
							<button
								type="submit"
								disabled={creating}
								className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-xl transition-all duration-150"
							>
								{creating ? (
									<>
										<svg
											className="animate-spin w-4 h-4"
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
										Creating Lead…
									</>
								) : (
									<>
										<svg
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<line x1="12" y1="5" x2="12" y2="19" />
											<line x1="5" y1="12" x2="19" y2="12" />
										</svg>
										Create Lead
									</>
								)}
							</button>

							<button
								type="button"
								onClick={() => setOpen(false)}
								className="px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
							>
								Cancel
							</button>
						</div>

						<p className="sm:col-span-2 text-center text-[11px] text-slate-400 -mt-1">
							Fields marked <span className="text-rose-400 font-semibold">*</span> are
							required
						</p>
					</form>
				</div>
			</div>
			{/* ── Header ──────────────────────────────────────── */}
			<div className="px-5 pt-5 pb-4 border-b border-slate-100">
				<div className="flex items-center justify-between mb-4">
					<div>
						<h2 className="text-sm font-bold text-gray-900 tracking-tight">
							Recent Leads
						</h2>
						<p className="text-xs text-slate-400 mt-0.5">
							{leads.length} total · {visible.length} shown
						</p>
					</div>
					<a
						href="/leads"
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
						placeholder="Search by name, product, area…"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all placeholder:text-slate-400"
					/>
				</div>

				{/* Status filter pills */}
				<div className="flex gap-1.5 flex-wrap">
					{statuses.map((s) => (
						<button
							key={s}
							onClick={() => setFilter(s)}
							className={`text-[11px] font-semibold px-3 py-1 rounded-full capitalize transition-colors ${
								filter === s
									? "bg-blue-600 text-white"
									: "bg-slate-100 text-slate-500 hover:bg-slate-200"
							}`}
						>
							{s}
						</button>
					))}
				</div>
			</div>

			{/* ── Table head ──────────────────────────────────── */}
			{visible.length > 0 && (
				<div className="grid grid-cols-12 gap-2 px-5 py-2 bg-slate-50 border-b border-slate-100">
					<p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider col-span-3">
						Lead
					</p>

					<p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider col-span-3">
						Product / Area
					</p>

					<p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider col-span-2">
						Status
					</p>

					<p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider col-span-4">
						{user.role === "admin" ? "Assign / Assigned Dealer" : "Action"}
					</p>
				</div>
			)}

			{/* ── Rows ────────────────────────────────────────── */}
			<div className="divide-y divide-slate-50">
				{visible.length === 0 ? (
					<EmptyState />
				) : (
					visible.map((lead, i) => {
						const assignedDealer = dealers.find((d) => d._id === lead.assignedDealer);
						const isSaving = assigning === lead._id;

						return (
							<div
								key={lead._id}
								className="grid grid-cols-12 gap-2 items-center px-5 py-3.5 hover:bg-slate-50/70 transition-colors group"
							>
								{/* Lead info */}
								<div className="col-span-3 flex items-center gap-2.5 min-w-0">
									<Avatar name={lead.name} idx={i} />
									<div className="min-w-0">
										<p className="text-xs font-semibold text-gray-800 truncate">
											{lead.name}
										</p>
										{/* <p className="text-[11px] text-slate-400 truncate">
											{lead.email ?? lead.phone ?? "—"}
										</p> */}
									</div>
								</div>

								{/* Product / Area */}
								<div className="col-span-3 min-w-0">
									<p className="text-xs font-medium text-gray-700 truncate">
										{lead.product ?? "—"}
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
											{lead.area ?? "—"}
										</p>
									</div>
								</div>

								{/* Status */}
								<div className="col-span-2">
									<StatusBadge status={lead.status} />
								</div>

								{/* Assign Dealer */}
								{lead.status == "pending" && (
									<div className="col-span-4 flex items-center gap-2">
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
												Saving…
											</div>
										) : assignedDealer ? (
											<div className="flex items-center gap-2 flex-1 min-w-0">
												<Avatar
													name={assignedDealer.name}
													idx={dealers.indexOf(assignedDealer)}
												/>
												<div className="min-w-0 flex-1">
													<p className="text-[11px] font-semibold text-gray-700 truncate">
														{assignedDealer.name}
													</p>
													<button
														onClick={() => handleAssign(lead._id, "")}
														className="text-[10px] text-slate-400 hover:text-rose-500 transition-colors"
													>
														Reassign
													</button>
												</div>
											</div>
										) : (
											<div className="relative flex-1">
												<select
													className="w-full appearance-none text-xs bg-slate-50 border border-slate-200 text-slate-600 rounded-lg pl-3 pr-7 py-2 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all cursor-pointer"
													value={lead.assignedDealer || ""}
													onChange={(e) =>
														handleAssign(lead._id, e.target.value)
													}
													disabled={isSaving}
												>
													<option value="">— Select dealer —</option>
													{dealers.map((d) => (
														<option key={d._id} value={d._id}>
															{d.name}
														</option>
													))}
												</select>
												<svg
													className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"
													width="11"
													height="11"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2.5"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<polyline points="6 9 12 15 18 9" />
												</svg>
											</div>
										)}
									</div>
								)}
								{lead.status != "pending" && (
									<div className="col-span-4 flex items-center gap-2.5">
										{/* <Avatar name={assignedDealer.name} idx={i} /> */}
										<p className="text-xs font-semibold text-slate-600">
											{assignedDealer ? `` : "No dealer assigned"}
										</p>
									</div>
								)}
							</div>
						);
					})
				)}
			</div>

			{/* ── Footer ──────────────────────────────────────── */}
			{visible.length > 0 && (
				<div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
					<p className="text-[11px] text-slate-400">
						Showing{" "}
						<span className="font-semibold text-slate-600">{visible.length}</span> of{" "}
						<span className="font-semibold text-slate-600">{leads.length}</span> leads
					</p>
					<div className="flex items-center gap-1.5">
						<span className="w-2 h-2 rounded-full bg-emerald-400" />
						<span className="text-[11px] text-slate-400">
							{leads.filter((l) => l.assignedDealer).length} assigned
						</span>
					</div>
				</div>
			)}
		</div>
	);
}
