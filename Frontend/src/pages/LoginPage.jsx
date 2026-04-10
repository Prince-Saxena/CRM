import { useState } from "react";
import { loginUser } from "../api/userAPI.jsx";
import { useUser } from "../context/userContextProvider.jsx";
import { useNavigate } from "react-router-dom";

export default function Login() {
	const [form, setForm] = useState({ email: "", password: "" });
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const { setUser } = useUser();
	const navigate = useNavigate();

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			// TODO: replace with your API call
			// console.log("API calling...");

			// console.log("Login payload →", form);
			const res = await loginUser(form);
			// console.log(res.data);

			localStorage.setItem("user", JSON.stringify(res.data.user));
			setUser(res.data.user);
			localStorage.setItem("token", res.data.token);

			// console.log("Login payload →", form);
			navigate("/", { replace: true });
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
			{/* Background subtle pattern */}
			<div
				className="absolute inset-0 opacity-40"
				style={{
					backgroundImage:
						"radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)",
					backgroundSize: "28px 28px",
				}}
			/>

			<div className="relative w-full max-w-md">
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
							Sign in
						</h1>
						<p className="text-sm text-slate-500">Access your CRM dashboard</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-5">
						{/* Email */}
						<div className="space-y-1.5">
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
						<div className="space-y-1.5">
							<div className="flex items-center justify-between">
								<label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
									Password
								</label>
								<a
									href="#"
									className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
								>
									Forgot password?
								</a>
							</div>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									name="password"
									value={form.password}
									onChange={handleChange}
									placeholder="Enter your password"
									required
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
									Signing in...
								</span>
							) : (
								"Sign In"
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
						Don't have an account?{" "}
						<a
							href="/signup"
							className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
						>
							Create account
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
