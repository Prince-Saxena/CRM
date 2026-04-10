import { useState, useRef, useEffect } from "react";
import { getProfile, updateProfile, changePassword } from "../api/userAPI.jsx";

const AVATAR_COLORS = ["#2563eb", "#10b981", "#f59e0b", "#f43f5e", "#7c3aed", "#0ea5e9", "#ec4899"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Avatar({ name, size = "lg", color }) {
	const initials =
		name
			?.split(" ")
			.map((w) => w[0])
			.join("")
			.slice(0, 2)
			.toUpperCase() ?? "??";
	const dim = size === "lg" ? "w-20 h-20 text-2xl" : "w-8 h-8 text-[11px]";
	return (
		<div
			className={`${dim} rounded-full flex items-center justify-center text-white font-bold ring-4 ring-white shrink-0`}
			style={{ background: color }}
		>
			{initials}
		</div>
	);
}

function RoleBadge({ role }) {
	const map = {
		admin: { bg: "bg-violet-50", text: "text-violet-700", dot: "bg-violet-500" },
		dealer: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
		customer: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
	};
	const s = map[role?.toLowerCase()] ?? map.customer;
	return (
		<span
			className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${s.bg} ${s.text}`}
		>
			<span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
			{role ?? "—"}
		</span>
	);
}

function InputField({
	label,
	name,
	value,
	onChange,
	type = "text",
	disabled = false,
	placeholder = "",
}) {
	return (
		<div className="space-y-1.5">
			<label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
				{label}
			</label>
			<input
				type={type}
				name={name}
				value={value}
				onChange={onChange}
				disabled={disabled}
				placeholder={placeholder}
				className={`w-full px-3.5 py-2.5 text-sm text-gray-900 border rounded-lg outline-none transition-all duration-150 placeholder:text-slate-400
          ${
				disabled
					? "bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed"
					: "bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
			}`}
			/>
		</div>
	);
}

function SectionCard({ title, subtitle, children, action }) {
	return (
		<div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
			<div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
				<div>
					<h2 className="text-sm font-bold text-gray-900 tracking-tight">{title}</h2>
					{subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
				</div>
				{action}
			</div>
			<div className="p-6">{children}</div>
		</div>
	);
}

function Toast({ message, type }) {
	if (!message) return null;
	const s =
		type === "success"
			? "bg-emerald-50 border-emerald-200 text-emerald-700"
			: "bg-rose-50 border-rose-200 text-rose-600";
	return (
		<div
			className={`flex items-center gap-2 text-xs font-medium px-4 py-2.5 rounded-xl border ${s}`}
		>
			{type === "success" ? (
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
					<polyline points="20 6 9 17 4 12" />
				</svg>
			) : (
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
					<circle cx="12" cy="12" r="10" />
					<line x1="12" y1="8" x2="12" y2="12" />
					<line x1="12" y1="16" x2="12.01" y2="16" />
				</svg>
			)}
			{message}
		</div>
	);
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Profile() {
	const [user,setUser] = useState()
	const mockUser = {
		name: "Arjun Sharma",
		email: "arjun.sharma@company.com",
		phone: "+91 98765 43210",
		role: "admin",
		area: "Central Delhi",
		city: "New Delhi",
		joinedAt: "2024-01-15T00:00:00.000Z",
		_id: "64f8a2b3c9e1d2f3a4b5c6d7",
	};

	useEffect(() => {
		(async () => {
			try {
				const user = await getProfile();
				console.log("Fetched profile:", user);
                setUser(user.data.data);
			} catch (error) {
				console.error("Failed to fetch profile:", error);
			}
		})();
	}, []);


	const avatarColor = AVATAR_COLORS[(user?.name?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];

	// ── Profile form state ────────────────────────────────
	const [editMode, setEditMode] = useState(false);
	const [saving, setSaving] = useState(false);
	const [toast, setToast] = useState(null);

	const [profile, setProfile] = useState({
		name: user?.name ?? "",
		email: user?.email ?? "",
		phone: user?.phone ?? "",
		area: user?.area ?? "",
		city: user?.city ?? "",
	});

	const handleProfileChange = (e) =>
		setProfile((p) => ({ ...p, [e.target.name]: e.target.value }));

	const handleProfileSave = async () => {
		setSaving(true);
		try {
			await updateProfile(profile);
			await new Promise((r) => setTimeout(r, 800)); // simulate
			showToast("Profile updated successfully", "success");
			setEditMode(false);
		} catch {
			showToast("Failed to update profile", "error");
		} finally {
			setSaving(false);
		}
	};

	// ── Password form state ───────────────────────────────
	const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
	const [pwSaving, setPwSaving] = useState(false);
	const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });

	const handlePwChange = (e) => setPwForm((p) => ({ ...p, [e.target.name]: e.target.value }));

	const togglePw = (field) => setShowPw((p) => ({ ...p, [field]: !p[field] }));

	const pwStrength = (pw) => {
		if (!pw) return null;
		if (pw.length < 6) return { label: "Weak", color: "bg-rose-400", w: "w-1/4" };
		if (pw.length < 10) return { label: "Fair", color: "bg-amber-400", w: "w-2/4" };
		if (!/[^a-zA-Z0-9]/.test(pw)) return { label: "Good", color: "bg-blue-400", w: "w-3/4" };
		return { label: "Strong", color: "bg-emerald-500", w: "w-full" };
	};

	const strength = pwStrength(pwForm.next);

	const handlePasswordSave = async () => {
		if (pwForm.next !== pwForm.confirm) {
			showToast("Passwords do not match", "error");
			return;
		}
		if (pwForm.next.length < 8) {
			showToast("Password must be at least 8 characters", "error");
			return;
		}
		setPwSaving(true);
		try {
			await changePassword({ currentPassword: pwForm.current, newPassword: pwForm.next });
			await new Promise((r) => setTimeout(r, 800));
			setPwForm({ current: "", next: "", confirm: "" });
			showToast("Password changed successfully", "success");
		} catch {
			showToast("Incorrect current password", "error");
		} finally {
			setPwSaving(false);
		}
	};

	// ── Toast helper ──────────────────────────────────────
	const showToast = (message, type) => {
		setToast({ message, type });
		setTimeout(() => setToast(null), 3500);
	};

	const joinDate = user?.joinedAt
		? new Date(user.joinedAt).toLocaleDateString("en-IN", {
				day: "2-digit",
				month: "long",
				year: "numeric",
			})
		: "—";

	return (
		<div className="min-h-screen bg-[#f8fafc] p-4 md:p-6 lg:p-8 space-y-5">
			{/* ── Page header ─────────────────────────────────── */}
			<div>
				<p className="text-xs  font-medium text-blue-600 uppercase tracking-widest mb-0.5">
					Account
				</p>
				<h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Profile</h1>
				<p className="text-sm text-slate-400 mt-0.5">
					Manage your personal information and security
				</p>
			</div>

			{/* Toast */}
			{toast && <Toast message={toast.message} type={toast.type} />}

			{/* ── Profile hero card ────────────────────────────── */}
			<div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
				{/* Cover band */}
				{/* <div className="h-24 z-0 bg-linear-to-r from-blue-600 via-blue-500 to-sky-400 relative">
					<div
						className="absolute inset-0 opacity-10"
						style={{
							backgroundImage:
								"radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
							backgroundSize: "20px 20px",
						}}
					/>
				</div> */}

				<div className="px-6 pb-6">
					{/* Avatar row */}
					<div className="flex flex-col z-10 sm:flex-row sm:items-end sm:justify-between mt-4 gap-4 mb-5">
						<div className="flex items-end gap-4">
							<div className="ring-4 ring-white rounded-full">
								<Avatar name={user?.name} size="lg" color={avatarColor} />
							</div>
							<div className="mb-1">
								<h2 className="text-lg font-bold text-gray-900 tracking-tight">
									{user?.name}
								</h2>
								<div className="flex items-center gap-2 mt-1 flex-wrap">
									<RoleBadge role={user?.role} />
									<span className="text-[11px] text-slate-400">
										Member since {joinDate}
									</span>
								</div>
							</div>
						</div>
						<div className="flex items-center gap-2 mb-1">
							<span className="font-mono text-[10px] text-slate-300 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg">
								ID: {user?._id?.slice(-8).toUpperCase()}
							</span>
						</div>
					</div>

					{/* Quick info strips */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
						{[
							{
								icon: (
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
								),
								label: "Email",
								value: user?.email,
							},
							{
								icon: (
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
								),
								label: "Phone",
								value: user?.phone ?? "—",
							},
							{
								icon: (
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
								),
								label: "Area",
								value: user?.area ?? "—",
							},
							{
								icon: (
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
										<rect x="2" y="7" width="20" height="14" rx="2" />
										<path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
									</svg>
								),
								label: "City",
								value: user?.city ?? "—",
							},
						].map(({ icon, label, value }) => (
							<div
								key={label}
								className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-3.5 py-2.5 border border-slate-100"
							>
								<span className="text-slate-400 shrink-0">{icon}</span>
								<div className="min-w-0">
									<p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">
										{label}
									</p>
									<p className="text-xs font-semibold text-gray-700 truncate">
										{value}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* ── Edit profile card ────────────────────────────── */}
			<SectionCard
				title="Personal Information"
				subtitle="Update your name, contact, and location"
				action={
					!editMode ? (
						<button
							onClick={() => setEditMode(true)}
							className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
						>
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
								<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
								<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
							</svg>
							Edit
						</button>
					) : (
						<button
							onClick={() => {
								setEditMode(false);
								setProfile({
									name: user.name,
									email: user.email,
									phone: user.phone ?? "",
									area: user.area ?? "",
									city: user.city ?? "",
								});
							}}
							className="text-xs font-semibold text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
						>
							Cancel
						</button>
					)
				}
			>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<InputField
						label="Full Name"
						name="name"
						value={profile.name}
						onChange={handleProfileChange}
						disabled={!editMode}
						placeholder="John Doe"
					/>
					<InputField
						label="Email Address"
						name="email"
						value={profile.email}
						onChange={handleProfileChange}
						disabled={!editMode}
						type="email"
						placeholder="you@company.com"
					/>
					<InputField
						label="Phone Number"
						name="phone"
						value={profile.phone}
						onChange={handleProfileChange}
						disabled={!editMode}
						placeholder="+91 XXXXX XXXXX"
					/>
					<div className="space-y-1.5">
						<label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
							Role
						</label>
						<div className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-lg">
							<RoleBadge role={user?.role} />
							<span className="text-[11px] text-slate-400">
								Role is managed by admin
							</span>
						</div>
					</div>
					<InputField
						label="Area"
						name="area"
						value={profile.area}
						onChange={handleProfileChange}
						disabled={!editMode}
						placeholder="e.g. South Delhi"
					/>
					<InputField
						label="City"
						name="city"
						value={profile.city}
						onChange={handleProfileChange}
						disabled={!editMode}
						placeholder="e.g. New Delhi"
					/>
				</div>

				{editMode && (
					<div className="mt-5 flex items-center gap-3 pt-5 border-t border-slate-100">
						<button
							onClick={handleProfileSave}
							disabled={saving}
							className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-60 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all"
						>
							{saving ? (
								<>
									<svg
										className="animate-spin w-3.5 h-3.5"
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
								</>
							) : (
								<>
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
										<polyline points="20 6 9 17 4 12" />
									</svg>
									Save Changes
								</>
							)}
						</button>
						<p className="text-[11px] text-slate-400">
							Changes will reflect immediately
						</p>
					</div>
				)}
			</SectionCard>

			{/* ── Change password card ─────────────────────────── */}
			<SectionCard
				title="Change Password"
				subtitle="Keep your account secure with a strong password"
			>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					{/* Current password */}
					<div className="sm:col-span-2 space-y-1.5">
						<label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
							Current Password
						</label>
						<div className="relative">
							<input
								type={showPw.current ? "text" : "password"}
								name="current"
								value={pwForm.current}
								onChange={handlePwChange}
								placeholder="Enter current password"
								className="w-full px-3.5 py-2.5 pr-10 text-sm text-gray-900 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all placeholder:text-slate-400"
							/>
							<button
								type="button"
								onClick={() => togglePw("current")}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
							>
								<EyeIcon open={showPw.current} />
							</button>
						</div>
					</div>

					{/* New password */}
					<div className="space-y-1.5">
						<label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
							New Password
						</label>
						<div className="relative">
							<input
								type={showPw.next ? "text" : "password"}
								name="next"
								value={pwForm.next}
								onChange={handlePwChange}
								placeholder="Min. 8 characters"
								className="w-full px-3.5 py-2.5 pr-10 text-sm text-gray-900 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all placeholder:text-slate-400"
							/>
							<button
								type="button"
								onClick={() => togglePw("next")}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
							>
								<EyeIcon open={showPw.next} />
							</button>
						</div>
						{strength && (
							<div className="space-y-1 pt-0.5">
								<div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
									<div
										className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.w}`}
									/>
								</div>
								<p className="text-[11px] text-slate-400">
									Strength:{" "}
									<span className="font-medium text-slate-600">
										{strength.label}
									</span>
								</p>
							</div>
						)}
					</div>

					{/* Confirm password */}
					<div className="space-y-1.5">
						<label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
							Confirm New Password
						</label>
						<div className="relative">
							<input
								type={showPw.confirm ? "text" : "password"}
								name="confirm"
								value={pwForm.confirm}
								onChange={handlePwChange}
								placeholder="Repeat new password"
								className={`w-full px-3.5 py-2.5 pr-10 text-sm text-gray-900 bg-slate-50 border rounded-lg outline-none focus:bg-white focus:ring-2 transition-all placeholder:text-slate-400 ${
									pwForm.confirm && pwForm.next !== pwForm.confirm
										? "border-rose-300 focus:border-rose-400 focus:ring-rose-50"
										: "border-slate-200 focus:border-blue-400 focus:ring-blue-50"
								}`}
							/>
							<button
								type="button"
								onClick={() => togglePw("confirm")}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
							>
								<EyeIcon open={showPw.confirm} />
							</button>
						</div>
						{pwForm.confirm && pwForm.next !== pwForm.confirm && (
							<p className="text-[11px] text-rose-500 flex items-center gap-1">
								<svg
									width="10"
									height="10"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<circle cx="12" cy="12" r="10" />
									<line x1="12" y1="8" x2="12" y2="12" />
									<line x1="12" y1="16" x2="12.01" y2="16" />
								</svg>
								Passwords don't match
							</p>
						)}
					</div>
				</div>

				<div className="mt-5 flex items-center gap-3 pt-5 border-t border-slate-100">
					<button
						onClick={handlePasswordSave}
						disabled={pwSaving || !pwForm.current || !pwForm.next || !pwForm.confirm}
						className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all"
					>
						{pwSaving ? (
							<>
								<svg
									className="animate-spin w-3.5 h-3.5"
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
								Updating…
							</>
						) : (
							<>
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
									<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
									<path d="M7 11V7a5 5 0 0 1 10 0v4" />
								</svg>
								Update Password
							</>
						)}
					</button>
					<p className="text-[11px] text-slate-400">
						You'll stay logged in after changing
					</p>
				</div>
			</SectionCard>

			{/* ── Danger zone ──────────────────────────────────── */}
			<div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
				<div className="px-6 py-4 border-b border-rose-100">
					<h2 className="text-sm font-bold text-gray-900 tracking-tight">Danger Zone</h2>
					<p className="text-xs text-slate-400 mt-0.5">Irreversible account actions</p>
				</div>
				<div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div>
						<p className="text-sm font-semibold text-gray-800">Delete Account</p>
						<p className="text-xs text-slate-400 mt-0.5">
							Permanently remove your account and all associated data. This cannot be
							undone.
						</p>
					</div>
					<button className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 border border-rose-200 hover:bg-rose-50 px-4 py-2 rounded-xl transition-colors shrink-0">
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
							<polyline points="3 6 5 6 21 6" />
							<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
							<path d="M10 11v6" />
							<path d="M14 11v6" />
							<path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
						</svg>
						Delete Account
					</button>
				</div>
			</div>
		</div>
	);
}

// ─── Eye icon helper ──────────────────────────────────────────────────────────
function EyeIcon({ open }) {
	return open ? (
		<svg
			width="15"
			height="15"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
			<path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
			<line x1="1" y1="1" x2="23" y2="23" />
		</svg>
	) : (
		<svg
			width="15"
			height="15"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
			<circle cx="12" cy="12" r="3" />
		</svg>
	);
}
