import express from "express";
import userAuth from "../middlewares/userAuth(readJWT).js";
import ConnectionRequest from "../models/connectionRequest.models.js";


const router = express.Router();

//Get all pending requests
router.get('/user/requests/incoming', userAuth, async (req, res) => {
	try {
		const loggedInUserId = req.user._id.toString();
		const requests = await ConnectionRequest.find({
			toUserId: loggedInUserId,
			status  : 'like'
		}).populate({path: 'fromUserId', select: ['firstName', 'lastName']});
		const Reqs = requests.map(r => {
			return `${r.fromUserId.firstName.charAt(0).toUpperCase() + r.fromUserId.firstName.slice(1)} ${r.fromUserId.lastName ? r.fromUserId.lastName : ''}`
		})
		if (requests.length === 0) {
			return res.status(200).json({
				message: 'No new requests found.',
				success: false
			})
		}

		return res.status(200).json({
			message: `${Reqs.length} new requests were found : ${Reqs}`,
			success: true,
			requests
		})
	} catch (e) {
		return res.status(400).json({message: e.message, success: false})
	}

})

router.get('/user/requests/outgoing', userAuth, async (req, res) => {
	try {

		const loggedInUser = req.user;
		const requests = await ConnectionRequest.find(
			{$and: [{fromUserId: loggedInUser}, {status: 'like'}]})
			.populate({
				path  : 'toUserId',
				select: 'firstName lastName'
			})
		if (!requests || requests.length === 0) {
			res.status(400).json({
				message: `you did not send any request,recently.`
			})
		}

		const recipients = requests.map(r => `${r.toUserId.firstName} ${r.toUserId.lastName}`).join(', ');

		res.status(200).json({
			data   : requests,
			message: `You sent requests to: ${recipients}`
		});


	} catch (e) {
		res.status(400).json({
			message: e.message
		})
	}

})


export default router;