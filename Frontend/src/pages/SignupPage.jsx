import { useState } from "react";
import { regUser } from "../api/userAPI.jsx";
import { useNavigate } from "react-router-dom";

const ROLES = [
	{ value: "admin", label: "Admin", desc: "Full system access" },
	{ value: "dealer", label: "Dealer", desc: "Manage deals & leads" },
	{ value: "customer", label: "Customer", desc: "View & track orders" },
];

export default function Signup() {
	const navigate = useNavigate();
	const [form, setForm] = useState({
		fname: "",
		lname: "",
		email: "",
		password: "",
		role: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			// TODO: replace with your API call
			console.log("API calling...");
			form.map((ele) => ele.trim());
			const res = await regUser({
				name: `${form.fname} ${form.lname}`,
				email: form.email,
				password: form.password,
				role: form.role,
			});
			console.log("API called!");
			navigate("/login");
			console.log("Signup payload →", form);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	// const passwordStrength = (pw) => {
	// 	if (!pw) return null;
	// 	if (pw.length < 6) return { label: "Weak", color: "bg-red-400", width: "w-1/4" };
	// 	if (pw.length < 10) return { label: "Fair", color: "bg-amber-400", width: "w-2/4" };
	// 	if (!/[^a-zA-Z0-9]/.test(pw))
	// 		return { label: "Good", color: "bg-blue-400", width: "w-3/4" };
	// 	return { label: "Strong", color: "bg-emerald-500", width: "w-full" };
	// };

	// const strength = passwordStrength(form.password);

	return (
		<div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
			{/* Background subtle pattern */}
			<div
				className="absolute inset-0 opacity-40"
				style={{
					backgroundImage:
						"radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)",
					backgroundSize: "28px 28px",
				}}
			/>

			<div className="relative w-full max-w-3xl">
				{/* Brand */}
				<div className="flex items-center gap-2.5 mb-8">
					<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="white"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
							<circle cx="9" cy="7" r="4" />
							<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
							<path d="M16 3.13a4 4 0 0 1 0 7.75" />
						</svg>
					</div>
					<span className="text-gray-800 font-semibold text-lg tracking-tight">
						CRMflow
					</span>
				</div>

				{/* Card */}
				<div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
					<div className="mb-7">
						<h1 className="text-2xl font-semibold text-gray-900 tracking-tight mb-1">
							Create account
						</h1>
						<p className="text-sm text-slate-500">
							Get started with your CRM workspace
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-5">
						{/* Full Name */}
						<div className="flex gap-2 ">
							<div className="w-1/2">
								<label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
									First Name
								</label>
								<input
									type="text"
									name="fname"
									value={form.fname}
									onChange={handleChange}
									placeholder="Prince"
									required
									className="w-full px-3.5 py-2.5 text-sm text-gray-900 bg-slate-50 border border-slate-200 rounded-lg outline-none transition-all duration-150 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
								/>
							</div>
							<div className="w-1/2">
								<label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
									Last Name
								</label>
								<input
									type="text"
									name="lname"
									value={form.lname}
									onChange={handleChange}
									placeholder="Saxena"
									required
									className="w-full px-3.5 py-2.5 text-sm text-gray-900 bg-slate-50 border border-slate-200 rounded-lg outline-none transition-all duration-150 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
								/>
							</div>
						</div>

						{/* Email */}
						<div className="flex gap-2">
							<div className="w-1/2">
								<label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
									Email address
								</label>
								<input
									type="email"
									name="email"
									value={form.email}
									onChange={handleChange}
									placeholder="you@company.com"
									required
									className="w-full px-3.5 py-2.5 text-sm text-gray-900 bg-slate-50 border border-slate-200 rounded-lg outline-none transition-all duration-150 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
								/>
							</div>

							{/* Password */}
							<div className="w-1/2">
								<label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
									Password
								</label>
								<div className="relative">
									<input
										type={showPassword ? "text" : "password"}
										name="password"
										value={form.password}
										onChange={handleChange}
										placeholder="Min. 8 characters"
										required
										minLength={8}
										className="w-full px-3.5 py-2.5 pr-10 text-sm text-gray-900 bg-slate-50 border border-slate-200 rounded-lg outline-none transition-all duration-150 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
									>
										{showPassword ? (
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
												<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
												<path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
												<line x1="1" y1="1" x2="23" y2="23" />
											</svg>
										) : (
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
												<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
												<circle cx="12" cy="12" r="3" />
											</svg>
										)}
									</button>
								</div>
								{/* Password strength bar */}
								{/* {strength && (
									<div className="space-y-1 pt-0.5">
										<div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
											<div
												className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`}
											/>
										</div>
										<p className="text-xs text-slate-400">
											Strength:{" "}
											<span className="font-medium text-slate-600">
												{strength.label}
											</span>
										</p>
									</div>
								)} */}
							</div>
						</div>

						{/* Role */}
						<div className="space-y-1.5">
							<label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
								Role
							</label>
							<div className="grid grid-cols-3 gap-2">
								{ROLES.map((r) => (
									<label
										key={r.value}
										className={`relative flex flex-col items-center gap-1 p-3 rounded-lg border cursor-pointer transition-all duration-150 ${
											form.role === r.value
												? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
												: "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
										}`}
									>
										<input
											type="radio"
											name="role"
											value={r.value}
											checked={form.role === r.value}
											onChange={handleChange}
											className="sr-only"
											required
										/>
										{/* Role icon */}
										<span
											className={`text-base ${form.role === r.value ? "text-blue-600" : "text-slate-400"}`}
										>
											{r.value === "admin" && (
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
													<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
												</svg>
											)}
											{r.value === "dealer" && (
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
													<line x1="12" y1="1" x2="12" y2="23" />
													<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
												</svg>
											)}
											{r.value === "customer" && (
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
													<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
													<circle cx="12" cy="7" r="4" />
												</svg>
											)}
										</span>
										<span
											className={`text-xs font-semibold tracking-wide capitalize ${form.role === r.value ? "text-blue-700" : "text-slate-600"}`}
										>
											{r.label}
										</span>
										{form.role === r.value && (
											<span className="absolute top-1.5 right-1.5">
												<svg
													width="10"
													height="10"
													viewBox="0 0 24 24"
													fill="#3b82f6"
												>
													<path d="M20 6L9 17l-5-5" />
													<polyline
														points="20 6 9 17 4 12"
														stroke="white"
														strokeWidth="3"
														fill="none"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
											</span>
										)}
									</label>
								))}
							</div>
						</div>

						{/* Submit */}
						<button
							type="submit"
							disabled={loading}
							className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-all duration-150 mt-1"
						>
							{loading ? (
								<span className="flex items-center justify-center gap-2">
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
									Creating account...
								</span>
							) : (
								"Create Account"
							)}
						</button>
					</form>

					{/* Divider */}
					<div className="flex items-center gap-3 my-6">
						<div className="flex-1 h-px bg-slate-200" />
						<span className="text-xs text-slate-400">or</span>
						<div className="flex-1 h-px bg-slate-200" />
					</div>

					<p className="text-center text-sm text-slate-500">
						Already have an account?{" "}
						<a
							href="/login"
							className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
						>
							Sign in
						</a>
					</p>
				</div>

				<p className="text-center text-xs text-slate-400 mt-6">
					© 2024 CRMflow. All rights reserved.
				</p>
			</div>
		</div>
	);
}
