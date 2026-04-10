function RecentOrders({ orders }) {
	return (
		<div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
			<h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>

			<div className="space-y-3">
				{orders.map((order) => (
					<div
						key={order._id}
						className="flex justify-between items-center border-b pb-2"
					>
						<div>
							<p className="text-sm font-medium text-gray-800">{order.product}</p>
							<p className="text-xs text-slate-500">₹ {order.totalAmount}</p>
						</div>
						<span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
							{order.status}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
export default RecentOrders;
