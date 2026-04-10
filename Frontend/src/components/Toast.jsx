// components/Toast.jsx
import { useEffect } from "react";

export default function Toast({ message, type = "info", onClose }) {
	useEffect(() => {
		const timer = setTimeout(() => {
			onClose();
		}, 5000); // 5 sec

		return () => clearTimeout(timer);
	}, [onClose]);

	const typeStyles = {
		success: "bg-green-500",
		error: "bg-red-500",
		info: "bg-blue-500",
	};

	return (
		<div
			className={`fixed top-5 right-5 text-white px-4 py-2 rounded-lg shadow-lg text-sm ${typeStyles[type]}`}
		>
			{message}
		</div>
	);
}