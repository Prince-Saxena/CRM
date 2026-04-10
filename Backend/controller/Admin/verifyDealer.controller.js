import User from "../../models/User.model.js";

const verifyDealer = async (req,res) =>{
    try {
        const user = await User.findByIdAndUpdate(
			req.params.id,
			{ status: "verified" },
			{ new: true },
		).select("-password");

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
        return res.status(200).json({message:"Dealer Verified",user})
    } catch (error) {
        return res.status(500).json({message:`Something went wrong while verifing Dealer! \n Error: ${error}`})
    }
}

export default verifyDealer