export default function LandingPage() {
	return (
		<div className="bg-gray-50 text-gray-800">
			{/* 🔹 Navbar */}
			<nav className="flex justify-between items-center px-8 py-4 shadow-md bg-white">
				<h1 className="text-2xl font-bold text-blue-600">CRM Pro</h1>
				<div className="space-x-6">
					<a href="#" className="hover:text-blue-600">
						Features
					</a>
					<a href="#" className="hover:text-blue-600">
						Login
					</a>
					<a href="#" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
						Get Started
					</a>
				</div>
			</nav>

			{/* 🔹 Hero Section */}
			<section className="text-center py-20 px-6">
				<h2 className="text-4xl font-bold mb-4">Manage Leads, Dealers & Orders Easily</h2>
				<p className="text-gray-600 mb-6">
					A complete CRM solution to manage your business workflow efficiently.
				</p>
				<button className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg">
					Start Free
				</button>
			</section>

			{/* 🔹 Features */}
			<section className="grid md:grid-cols-3 gap-8 px-10 py-16">
				<div className="bg-white p-6 rounded-xl shadow">
					<h3 className="text-xl font-semibold mb-2">Lead Management</h3>
					<p>Track and verify all customer leads easily.</p>
				</div>

				<div className="bg-white p-6 rounded-xl shadow">
					<h3 className="text-xl font-semibold mb-2">Dealer Assignment</h3>
					<p>Assign leads to dealers based on area.</p>
				</div>

				<div className="bg-white p-6 rounded-xl shadow">
					<h3 className="text-xl font-semibold mb-2">Order Tracking</h3>
					<p>Convert leads into orders and track them.</p>
				</div>
			</section>

			{/* 🔹 How It Works */}
			<section className="bg-blue-50 py-16 text-center">
				<h2 className="text-3xl font-bold mb-10">How It Works</h2>

				<div className="grid md:grid-cols-3 gap-6 px-10">
					<div>
						<h3 className="font-semibold">1. Add Lead</h3>
						<p>Customer submits query</p>
					</div>
					<div>
						<h3 className="font-semibold">2. Verify & Assign</h3>
						<p>Admin verifies and assigns dealer</p>
					</div>
					<div>
						<h3 className="font-semibold">3. Convert to Order</h3>
						<p>Dealer confirms and creates order</p>
					</div>
				</div>
			</section>

			{/* 🔹 CTA */}
			<section className="text-center py-20">
				<h2 className="text-3xl font-bold mb-4">Ready to Grow Your Business?</h2>
				<button className="bg-green-600 text-white px-6 py-3 rounded-lg">
					Get Started Now
				</button>
			</section>

			{/* 🔹 Footer */}
			<footer className="bg-gray-900 text-white text-center py-6">
				<p>© 2026 CRM Pro. All rights reserved.</p>
			</footer>
		</div>
	);
}
