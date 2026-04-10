import app from "./app.js";
import connectDB from "./config/connectDB.js";
import { configDotenv } from "dotenv";

configDotenv()
const PORT = process.env.PORT || 5000;

const startServer = async () => {
	try {
        await connectDB();
		console.log("Database connected");
		app.listen(PORT, () => console.log("Server up Baby!", PORT));
	} catch (error) {
		console.log(error);
	}
};

startServer();
