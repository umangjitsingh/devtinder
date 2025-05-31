import express from 'express';
import dotenv from 'dotenv';
import connect_db from "./services/DB.js";
import User from "./models/user.model.js";
import bcrypt from "bcrypt"
import {validateLoginData, validateRegisterData} from "./services/validateIncomingData.js";
import cookieParser from 'cookie-parser';
import {authenticateUser} from "./services/auth(JWT).js";
import jwt from "jsonwebtoken";


dotenv.config();


const app = express();
app.use(express.json());
app.use(cookieParser());

// Post user
app.post('/signup', async (req, res) => {
	try {
		await validateRegisterData(req.body);
		const {
			firstName, lastName, emailId, password, age, gender, about, skills, photoUrl
		} = req.body;

		const hashPassword = await bcrypt.hash(password, 10);

		const user = new User({
			firstName, lastName, emailId, password: hashPassword, age, gender, about, skills, photoUrl
		})

		await user.save();
		return res.status(201).json({
			message: 'user created', success: true, user
		})
	} catch (e) {
		return res.status(400).json({
			message: e.message, success: false
		})
	}
});


// Login user
app.post('/login', async (req, res) => {
	try {
		const {emailId, password} = req.body;
		await validateLoginData(emailId, password);

		const user = await User.findOne({emailId: emailId});


		if (!user) {
			return res.status(404).json({
				message: "No user found",
				success: false
			})
		}
		const isPasswordMatch = await bcrypt.compare(password, user.password);
		if (isPasswordMatch) {

			const token = await authenticateUser(user._id.toString())
			res.cookie("token", token)
			let Lname = user.lastName || "";
			return res.status(200).json({
				message: `${user.firstName} ${Lname}, is logged in successfully.. `,
				success: true,
				user
			})
		}
	} catch (e) {
		res.status(400).json({
			success: false,
			message: e.message
		})
	}

})

// Profile API - get
app.get('/profile', async (req, res) => {
	const {token} = req.cookies;

	const decodeToken = await jwt.verify(token, process.env.JWT_SECRET);
	const {userId} = decodeToken;

	const user = await User.findOne({_id: userId})
	if (!user) {
		res.status(404).json({
			message: "User not found", success: false
		})
	}
	res.status(200).json({
		success: true, user,message:`Logged in user is ${user.firstName} ${user.lastName || ""}`
	})


})


// Feed API - Get/feed - get all users from db.
app.get('/feed', async (req, res) => {
	try {
		const users = await User.find({});
		if (!users) {
			return res.status(404).json({
				message: "no users found", success: false
			})
		}
		return res.status(200).json({
			message: "list of all users", users
		})
	} catch (e) {
		return res.status(400).json({
			message: `Something went wrong :${e}`, success: false
		})
	}

});

// Get user by firstName
app.get('/user', async (req, res) => {
	try {
		const {firstName} = req.body;
		const user = await User.findOne({firstName});
		if (!user) {
			res.status(404).json({
				message: "User not found", success: false
			})
		}
		res.status(200).json({
			success: true, user
		})
	} catch (e) {
		res.status(400).json({
			message: `Something went wrong :${e.message}`, success: false
		})
	}

})

// Delete a user
app.delete('/user/:id', async (req, res) => {
	try {
		const userId = req.params.id;

		const user = await User.findByIdAndDelete({_id: userId.toString()})
		if (!user) {
			return res.status(404).json({
				message: "no user found", success: false
			})
		}
		return res.status(200).json({
			message: `${user.firstName} is deleted`, success: true,
		})
	} catch (e) {
		return res.status(400).json({
			message: e.message, success: false
		})
	}
})

// update a user
app.patch('/user/:id', async (req, res) => {
	try {
		const userId = req.params.id;
		const data = req.body;

		const ALLOWED_UPDATES_ARRAY = ["lastName", "gender", "password", "about", "skills", "photoUrl"];

		const IS_PERMITTED = Object.keys(data).every((k) => {
			return ALLOWED_UPDATES_ARRAY.includes(k)
		})

		if (!IS_PERMITTED) {
			return res.status(400).json({
				message: "This field cannot be changed..",
				success: false
			})
		}

		const user = await User.findByIdAndUpdate({_id: userId}, data
			, {returnDocument: 'after', runValidators: true});
		if (!user) {
			return res.status(400).json({
				message: "user cannot be updated", success: false
			})
		}
		return res.status(201).json({
			message: 'user updated', success: true, user
		})

	} catch (e) {
		return res.status(400).json({
			message: ` ${e.message}`,
			success: false
		})
	}
})

connect_db().then(() => {
	console.log('DB connected');
	app.listen(process.env.PORT, () => {
		console.log(`Server Listening on : http://localhost:${process.env.PORT}`)
	})
}).catch((e) => {
	console.log('database cannot be connected', e);
	process.exit(1);
})

