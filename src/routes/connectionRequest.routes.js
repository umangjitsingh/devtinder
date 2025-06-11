import express from "express";
import userAuth from "../middlewares/userAuth(readJWT).js";
import User from "../models/user.model.js";

const router =express.Router();

// POST /request/send/like/:userId
// POST /request/send/pass/user:id

router.post('/request/send/:initial/:id',userAuth,async(req,res)=>{
	try{
		const loggedInUser=req.user;
		const {initial,id}=req.params;
		const huntedUser= await User.findById(id)
		console.log(req.params)
res.send(huntedUser +" "+initial)

	}
	catch(e){
		res.status(400).json({message:e.message,success:false})
	}
})


// POST  /request/review/accepted/:requestId
// POST /request/review/rejected/:requestId








export default router;