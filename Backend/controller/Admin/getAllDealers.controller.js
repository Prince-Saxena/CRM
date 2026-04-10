import User from "../../models/User.model.js";

const getAllDealers = async (req, res) => {
    try {
        const dealers = await User.find({ role: "dealer" }).select("-password -__v");
        res.status(200).json({ success: true, data: dealers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default getAllDealers;