import { useEffect, useState } from "react";
import { useUser } from "../context/userContextProvider.jsx";
import { createTask, getAllTask, cancelTask, getTaskMeta } from "../api/adminAPI.jsx";
import { getMyTask, updTask } from "../api/dealerAPI.jsx";
import Toast from "../components/Toast.jsx";

const TASK_TYPES = ["call", "whatsapp", "meeting", "visit", "demo", "followup", "payment"];
const STATUS_OPTIONS = ["pending", "completed", "overdue"];

const STATUS_MAP = {
	pending: { bg: "bg-amber-50", text: "text-amber-700" },
	completed: { bg: "bg-emerald-50", text: "text-emerald-700" },
	cancelled: { bg: "bg-rose-50", text: "text-rose-600" },
	overdue: { bg: "bg-red-50", text: "text-red-600" },
};

function StatusBadge({ status }) {
	const s = STATUS_MAP[status] || STATUS_MAP.pending;
	return <span className={`px-2 py-1 text-[11px] rounded-full ${s.bg} ${s.text}`}>{status}</span>;
}

export default function Task() {
	const { user } = useUser();

	const [tasks, setTasks] = useState([]);
	const [dealers, setDealers] = useState([]);
	const [leads, setLeads] = useState([]);
	const [filteredLeads, setFilteredLeads] = useState([]);
	const [toast, setToast] = useState(null);
	const [filter, setFilter] = useState("all");

	const [form, setForm] = useState({
		title: "",
		type: "",
		dueDate: "",
		assignedTo: "",
		dealer: "",
		lead: "",
	});

	// ─── Fetch Data ──────────────────────
	useEffect(() => {
		(async () => {
			try {
				if (user.role === "admin") {
					const res = await getAllTask();
					setTasks(res.data.tasks);

					const meta = await getTaskMeta();
					setDealers(meta.data.dealers);
					setLeads(meta.data.leads);
				} else {
					const res = await getMyTask();
					setTasks([...res.data.overdue, ...res.data.upcoming, ...res.data.completed]);
				}
			} catch (err) {
				console.log(err);
			}
		})();
	}, [user]);

	// ─── Create Task ─────────────────────
	const handleCreate = async (e) => {
		e.preventDefault();

		try {
			const res = await createTask(form);
			setTasks((prev) => [res.data.task, ...prev]);

			setToast({ message: "Task created", type: "success" });

			setForm({
				title: "",
				type: "",
				dueDate: "",
				assignedTo: "",
				dealer: "",
				lead: "",
			});
			setFilteredLeads([]);
		} catch {
			setToast({ message: "Error creating task", type: "error" });
		}
	};

	// ─── Status Change ───────────────────
	const handleStatusChange = async (id, status) => {
		await updTask(id, { status, remark: "updated" });
		setTasks((prev) => prev.map((t) => (t._id === id ? { ...t, status } : t)));
	};

	// ─── Cancel Task ─────────────────────
	const handleCancel = async (id) => {
		await cancelTask(id);
		setTasks((prev) => prev.map((t) => (t._id === id ? { ...t, status: "cancelled" } : t)));
	};

	// ─── Filter Tasks ────────────────────
	const visible = tasks.filter((t) => {
		if (filter === "all") return true;
		return t.status === filter;
	});

	return (
		<div className="bg-white rounded-xl shadow border">
			{toast && (
				<Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
			)}

			{/* ─── Create Task ─── */}
			{user.role === "admin" && (
				<div className="p-5 border-b">
					<h2 className="text-sm font-bold mb-3">Create Task</h2>

					<form onSubmit={handleCreate} className="grid grid-cols-2 gap-3">
						<input
							placeholder="Title"
							value={form.title}
							onChange={(e) => setForm({ ...form, title: e.target.value })}
							required
							className="border p-2 rounded text-sm"
						/>

						<select
							value={form.type}
							onChange={(e) => setForm({ ...form, type: e.target.value })}
							required
							className="border p-2 rounded text-sm"
						>
							<option value="">Select Type</option>
							{TASK_TYPES.map((t) => (
								<option key={t} value={t}>
									{t}
								</option>
							))}
						</select>

						<input
							type="date"
							value={form.dueDate}
							onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
							required
							className="border p-2 rounded text-sm"
						/>

						{/* Dealer */}
						<select
							value={form.assignedTo}
							onChange={(e) => {
								const dealerId = e.target.value;

								const filtered = leads.filter(
									(l) => String(l.assignedDealer) === String(dealerId),
								);

								setFilteredLeads(filtered);

								setForm({
									...form,
									assignedTo: dealerId,
									dealer: dealerId,
									lead: "",
								});
							}}
							className="border p-2 rounded text-sm"
							required
						>
							<option value="">Select Dealer</option>
							{dealers.map((d) => (
								<option key={d._id} value={d._id}>
									{d.name}
								</option>
							))}
						</select>

						{/* Lead */}
						<select
							value={form.lead}
							onChange={(e) => {
								const leadId = e.target.value;
								const selectedLead = leads.find((l) => l._id === leadId);

								setForm({
									...form,
									lead: leadId,
									assignedTo: selectedLead?.assignedDealer || "",
									dealer: selectedLead?.assignedDealer || "",
								});

								const filtered = leads.filter(
									(l) =>
										String(l.assignedDealer) ===
										String(selectedLead?.assignedDealer),
								);

								setFilteredLeads(filtered);
							}}
							className="border p-2 rounded text-sm"
						>
							<option value="">Select Lead</option>

							{filteredLeads.length > 0 ? (
								filteredLeads.map((l) => (
									<option key={l._id} value={l._id}>
										{l.name}
									</option>
								))
							) : (
								<option value="">NA</option>
							)}
						</select>

						<button className="col-span-2 bg-blue-600 text-white py-2 rounded text-sm">
							Create Task
						</button>
					</form>
				</div>
			)}

			{/* Header */}
			<div className="p-4 border-b flex justify-between">
				<h2 className="text-sm font-bold">Tasks</h2>

				<div className="flex gap-2">
					{["all", "pending", "completed", "overdue", "cancelled"].map((f) => (
						<button
							key={f}
							onClick={() => setFilter(f)}
							className={`px-3 py-1 text-xs rounded ${
								filter === f ? "bg-blue-600 text-white" : "bg-gray-100"
							}`}
						>
							{f}
						</button>
					))}
				</div>
			</div>

			{/* Table */}
			<div className="grid grid-cols-12 px-5 py-2 bg-gray-50 text-xs font-semibold">
				<div className="col-span-4">Title</div>
				<div className="col-span-3">Type</div>
				<div className="col-span-3">Due Date</div>
				<div className="col-span-2">Action</div>
			</div>

			<div>
				{visible.map((task) => (
					<div key={task._id} className="grid grid-cols-12 px-5 py-3 border-t text-sm">
						<div className="col-span-4">{task.title}</div>
						<div className="col-span-3">{task.type}</div>
						<div className="col-span-3">
							{new Date(task.dueDate).toLocaleDateString()}
						</div>

						<div className="col-span-2 flex gap-2 items-center">
							<StatusBadge status={task.status} />

							{task.status !== "cancelled" && (
								<>
									{user.role === "dealer" && (
										<select
											value={task.status}
											onChange={(e) =>
												handleStatusChange(task._id, e.target.value)
											}
											className="text-xs border rounded px-2 py-1"
										>
											{STATUS_OPTIONS.map((s) => (
												<option key={s} value={s}>
													{s}
												</option>
											))}
										</select>
									)}

									{user.role === "admin" && (
										<button
											onClick={() => handleCancel(task._id)}
											className="text-red-500 text-xs"
										>
											✖
										</button>
									)}
								</>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
