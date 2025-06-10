import express from 'express';
import dotenv from 'dotenv';
import connect_db from "./services/DB.js";
import cookieParser from 'cookie-parser';
import router from './routes/user.routes.js'

dotenv.config();


const app = express();
app.use(express.json());
app.use(cookieParser());


connect_db().then(() => {
	console.log('DB connected');
	app.listen(process.env.PORT, () => {
		console.log(`Server Listening on : http://localhost:${process.env.PORT}`)
	})
}).catch((e) => {
	console.log('database cannot be connected', e);
	process.exit(1);
})

