import express from 'express';
import dotenv from 'dotenv';
import connect_db from "./services/DB.js";
import User from "./models/user.model.js";


dotenv.config();


const app = express();
app.use(express.json());

// Post user
app.post('/signup', async (req, res) => {
	try {
		const {
			firstName, lastName, emailId, password, age, gender, about, skills, photoUrl
		} = req.body;
		const user = new User({
			firstName, lastName, emailId, password, age, gender, about, skills, photoUrl
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

// Get user by email
app.get('/user', async (req, res) => {
	try {
		const {emailId} = req.body;
		const user = await User.findOne({emailId});
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
			message: `Something went wrong :${e}`, success: false
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
		const {
			firstName, lastName, password, age, gender, about, skills, photoUrl,emailId
		} = req.body;
		if(emailId){
			return res.status(400).json({
				message:"emailId cannot be changed",
				success:false
			})
		}
		const user = await User.findByIdAndUpdate({_id: userId}, {
			firstName, lastName, age, gender, password, about, skills, photoUrl
		}, {returnDocument: 'after',runValidators:true});
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

