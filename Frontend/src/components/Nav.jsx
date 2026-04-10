export default function Nav() {
	return (
		<div className="h-14 bg-white border-b flex items-center justify-between px-6">
			<input
				type="text"
				placeholder="Search..."
				className="border rounded px-3 py-1 text-sm outline-none"
			/>

			<div className="text-sm font-medium">Prince</div>
		</div>
	);
}
