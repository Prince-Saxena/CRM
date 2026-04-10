function Skeleton({ className }) {
	return <div className={`animate-pulse bg-slate-100 rounded-lg ${className}`} />;
}

function DashboardSkeleton() {
	return (
		<div className="min-h-screen bg-slate-50 p-6 space-y-6">
			<Skeleton className="h-8 w-48" />
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				{[...Array(4)].map((_, i) => (
					<Skeleton key={i} className="h-28" />
				))}
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<Skeleton className="h-72" />
				<Skeleton className="h-72" />
			</div>
		</div>
	);
}
export default DashboardSkeleton;