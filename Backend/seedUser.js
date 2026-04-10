import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.model.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const areas = ["north", "south", "east", "west"];

const cities = {
	north: ["Delhi", "Chandigarh", "Jaipur"],
	south: ["Mumbai", "Bangalore", "Chennai"],
	east: ["Kolkata", "Bhubaneswar", "Patna"],
	west: ["Lucknow", "Kanpur", "Indore"],
};

const updateUsers = async () => {
	try {
		const dealers = await User.find({ role: "dealer" });

		for (let i = 0; i < dealers.length; i++) {
			const area = areas[i % 4];
			const cityList = cities[area];
			const city = cityList[i % cityList.length];

			await User.findByIdAndUpdate(dealers[i]._id, {
				area,
				city,
			});
		}

		console.log("✅ Dealers updated with area & city");
		process.exit();
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

updateUsers();
