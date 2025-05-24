import express from 'express';
import dotenv from 'dotenv';
import connect_db from "./services/DB.js";
import User from "./models/user.model.js";


dotenv.config();


const app = express();
app.use(express.json());

app.post('/signup', async (req, res) => {
	try {
		const {
			firstName, lastName, emailId, password, age, gender
		} = req.body;
		const user = new User({
			firstName, lastName, emailId, password, age, gender
		})
		console.log(user)

		await user.save();
		res.status(201).json({
			message: 'user created',
			success: true,
			user
		})
	} catch (e) {
		res.status(400).json({
			message: e.message,
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

