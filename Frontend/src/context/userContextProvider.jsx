import React, { useContext, useEffect, useState, createContext } from "react";

const userContext = createContext();

export const UserContextProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	const [loading, setLoading] = useState(true);
	const [data, setData] = useState(true);

	useEffect(() => {
		const storedUser = localStorage.getItem("user");

		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}

		setLoading(false);
	}, []);

	return (
		<userContext.Provider value={{ user, setUser, loading, data, setData }}>
			{children}
		</userContext.Provider>
	);
};

export const useUser = () => useContext(userContext);
