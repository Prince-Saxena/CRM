function StatCard({ title, value, icon, color, change, changeLabel, suffix = "" }) {
	const isUp = change >= 0;

	return (
		<div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-lg transition-all duration-200 flex flex-col gap-4">
			{/* Top Section */}
			<div className="flex items-center justify-between">
				<div
					className="w-11 h-11 rounded-xl flex items-center justify-center"
					style={{ background: color + "18" }}
				>
					<span style={{ color }} className="text-lg">
						{icon}
					</span>
				</div>

				{/* Change Indicator */}
				{change !== undefined && (
					<div
						className={`text-xs font-medium px-2 py-1 rounded-md ${
							isUp ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
						}`}
					>
						{isUp ? "+" : ""}
						{change}%
					</div>
				)}
			</div>

			{/* Middle Section */}
			<div>
				<h2 className="text-2xl font-bold text-gray-900 tracking-tight">
					{value?.toLocaleString()}
					<span className="text-sm font-medium text-gray-500 ml-1">{suffix}</span>
				</h2>

				<p className="text-sm text-slate-500 mt-1">{title}</p>
			</div>

			{/* Bottom Section */}
			{changeLabel && <div className="text-xs text-slate-400">{changeLabel}</div>}
		</div>
	);
}

export default StatCard