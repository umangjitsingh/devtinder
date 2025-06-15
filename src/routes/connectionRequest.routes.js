import express from "express";
import userAuth from "../middlewares/userAuth(readJWT).js";
import ConnectionRequest from "../models/connectionRequest.models.js";
import User from "../models/user.model.js";


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

		let request = await ConnectionRequest.findOne({$or: [{fromUserId, toUserId},
				{fromUserId: toUserId, toUserId: fromUserId}]})
		if (request) {
			return res.status(400).json({
				message: 'Connection request already exists.',
				success: false
			})
		}
		request = new ConnectionRequest({fromUserId, toUserId, status})
		await request.save();
		await request.populate({ path: 'fromUserId toUserId', select: 'firstName lastname' });
		return res.status(201).json({
			message: `${request.fromUserId.firstName} ${request.fromUserId.lastName} has 
			${(status === 'like') ? 'liked' : 'passed'} ${request.toUserId.firstName} ${request.toUserId.lastName}`

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

		const toUser = await User.findById(toUserId).select('firstName lastName');
		const fromUser = await User.findById(fromUserId).select('firstName lastName');

		if (!toUser || !fromUser) {
			return res.status(400).json({message: "One or both users not found.", success: false});
		}

		let connection = await ConnectionRequest.findOne({
			$or: [{
				fromUserId: fromUserId, toUserId: toUserId,
				status    : 'like'
			},
				{
					fromUserId: toUserId, toUserId: fromUserId,
					status    : 'like'
				}]
		});
		let alreadyAdded = await ConnectionRequest.findOne({
			$or: [{
				fromUserId: fromUserId, toUserId: toUserId,
				status    : 'accepted'
			},
				{
					fromUserId: toUserId, toUserId: fromUserId,
					status    : 'accepted'
				}]
		});


		if (alreadyAdded && (status === 'accepted')) {
			return res.status(400).json({
				message: `${toUser.firstName} ${toUser.lastName} and ${fromUser.firstName} ${fromUser.lastName} are friends already`
			})
		}

		if (alreadyAdded && status === "rejected") {
			connection.status = "rejected";
			await connection.save();
			return res.status(201).json({
				message: `${toUser.firstName} ${toUser.lastName} rejected ${fromUser.firstName} ${fromUser.lastName}`
			});
		}



		if (!connection && (status === 'pass')) {
			return res.status(400).json({
				message: 'Connection Request passed/ignored',
				success: false
			})
		}


		connection.status = status;
		await connection.save();
		return res.status(201).json({
			message: `${toUser.firstName} ${toUser.lastName} ${status}ed ${fromUser.firstName} ${fromUser.lastName} `
		})


	} catch (e) {
		return res.status(400).json({
			message: e.message,
			success: false
		})
	}
})


export default router;