import express from "express";
import userAuth from "../middlewares/userAuth(readJWT).js";
import ConnectionRequest from "../models/connectionRequest.models.js";
import User from "../models/user.model.js";


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
			message: `You sent requests to: ${recipients}`,
			data   : requests
		});


	} catch (e) {
		res.status(400).json({
			message: e.message
		})
	}

})

// Feed API - what friends are suggested
router.get('/feed', userAuth, async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		limit = limit > 20 ? 20 : limit;

		const loggedInUserId = req.user._id.toString();

		const connectionRequests = await ConnectionRequest.find({
			$or: [
				{toUserId: loggedInUserId},
				{fromUserId: loggedInUserId}
			]
		}).populate("toUserId", ["firstName"])
			.populate("fromUserId", ["firstName"])
		const PeopleAddedAlreadyIds = connectionRequests.flatMap(p => [p.fromUserId._id, p.toUserId._id])

		const idsToIgnore = new Set(PeopleAddedAlreadyIds)


		const suggestedUsers = await User.find({
			_id: {$nin: Array.from(idsToIgnore)}
		}).select("firstName lastName").skip((page - 1) * limit).limit(limit)

		res.status(200).json({
			message: suggestedUsers,
			success: true
		})

	} catch (e) {
		res.status(400).json({
			message: 'Error :' + e.message,
			success: false
		})
	}
})

export default router;