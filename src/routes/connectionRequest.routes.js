import express from "express";
import userAuth from "../middlewares/userAuth(readJWT).js";
import ConnectionRequest from "../models/connectionRequest.models.js";


const router = express.Router();

// POST /request/send/:status/:toUserId - status => like /pass
// POST /request/send/:status/:toUserId - status => like /pass


router.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
	try {
		const fromUserId = req.user._id.toString();
		const {status, toUserId} = req.params;

		if(fromUserId === toUserId){
			return res.status(400).json({
				message:'Nice joke, you cannot send request to yourself.'
			})
		}

		let request = await ConnectionRequest.findOne({fromUserId, toUserId,status});
		if (request) {
			return res.status(400).json({
				message: 'Connection request already exists.',
				status : false
			})
		}
		request = new ConnectionRequest({fromUserId,toUserId,status})
		await request.save();
		return res.status(201).json({
			message:`${fromUserId} has ${status}ed ${toUserId}`
		})

	} catch (e) {
		return res.status(400).json({message: e.message, success: false})
	}
})


// POST  /request/review/accepted/:requestId
// POST /request/review/rejected/:requestId


export default router;