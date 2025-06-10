import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


const userAuth = async (req, res, next) => {
	try {
		const {token} = req.cookies;
		if (!token) {
			throw new Error("Invalid credentials. Please, login again")
		}
		const decodeToken = await jwt.verify(token, process.env.JWT_SECRET);
		const {userId} = decodeToken;
		const user = await User.findOne({_id: userId})
		if (!user) {
			throw new Error("User not found..")
		}
		req.user = user;
		next()
	} catch (e) {
		return res.status(400).send(e.message)
	}
}
export default userAuth;