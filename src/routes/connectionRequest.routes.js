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
		const ALLOWED_STATUS = ['like', 'pass'];

		if (!ALLOWED_STATUS.includes(status)) {
			return res.status(400).json({
				message: `Invalid status : ${status}`,
				success: false
			})
		}


		if (fromUserId === toUserId) {
			return res.status(400).json({
				message: 'Nice joke, you cannot send request to yourself.'
			})
		}

		let request = await ConnectionRequest.findOne({$or:[{fromUserId, toUserId},{fromUserId:toUserId,toUserId: fromUserId}]});
		if (request) {
			return res.status(400).json({
				message: 'Connection request already exists.',
				success : false
			})
		}
		request = new ConnectionRequest({fromUserId, toUserId, status})
		await request.save();
		return res.status(201).json({
			message: `${fromUserId} has ${(status ==='like')?'liked' :'passed'} ${toUserId}`
		})

	} catch (e) {
		return res.status(400).json({message: e.message, success: false})
	}
})


// POST  /request/review/accepted/:requestId
// POST /request/review/rejected/:requestId


router.post('/request/review/:status/:fromUserId', userAuth, async (req, res) => {
	try {
		const toUserId = req.user._id.toString();
		const {status, fromUserId} = req.params;
		if (status !== 'accepted' && status !== 'rejected') {
			return res.status(400).json({
				message: 'Wrong connection request status.',
				success: false
			})
		}
		if (fromUserId === toUserId) {
			return res.status(400).json({
				message: 'Nice joke, you cannot send request to yourself.'
			})
		}
		let connection = await ConnectionRequest.findOne({$or: [{fromUserId: fromUserId, toUserId: toUserId, status: 'like'}, {fromUserId: toUserId, toUserId: fromUserId, status: 'like'}]});
		console.log(connection)

		if (!connection) {
			return res.status(400).json({
				message: 'Connection Request passed',
				success: false
			})
		}
		connection = await new ConnectionRequest({fromUserId, toUserId, status});
		connection.status=status;
		await connection.save();
		return res.status(201).json({
			message: `${toUserId} ${status}ed ${fromUserId} `
		})


	} catch (e) {
		return res.status(400).json({
			message: e.message,
			success: false
		})
	}
})


export default router;