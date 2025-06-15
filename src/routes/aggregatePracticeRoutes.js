import express from "express";
import User from "../models/user.model.js";


const router = express.Router();
router.get('/stars', async (req, res) => {
	try {

		const players = await User.aggregate([
			{$match: {}}
		])
		res.status(200).json({
			message: 'Welcome cricket players',
			success: true,
			players
		})

	} catch (e) {
		res.status(400).json({success: false, message: e.message})
	}
})

router.get('/stars/:gender', async (req, res) => {
	try {
		const gender = req.params.gender;
		const genderMorF = await User.aggregate([
			{$match: {gender: gender}}
		])
		res.status(200).json({
			message: 'Welcome women cricket players',
			success: true,
			genderMorF
		})

	} catch (e) {
		res.status(400).json({success: false, message: e.message})
	}
})

router.get('/count', async (req, res) => {
	try {
		const genderFilter = req.query.gender ? {gender: req.query.gender} : {};
		const playerCount = await User.aggregate([
			{$match: genderFilter},
			{$group: {_id: '$gender', count: {$sum: 1}}}
		]);
		res.status(200).json({
			message: 'Player count retrieved successfully',
			success: true,
			playerCount
		});
	} catch (e) {
		res.status(400).json({success: false, message: e.message});
	}
});

router.get('/captain',async (req,res)=>{
	try {

		const captains = await User.aggregate([
			{$match: {skills:'captaincy',age:{$gt:20}}},
			{$group:{_id:'$gender',totalAge:{$sum:'$age'}}}
		])
		res.status(200).json({
			message: 'Welcome captains',
			success: true,
			captains
		})

	} catch (e) {
		res.status(400).json({success: false, message: e.message})
	}
})
export default router;