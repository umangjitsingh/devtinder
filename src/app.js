import express from 'express';
import dotenv from 'dotenv';
import connect_db from "./services/DB.js";
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes.js'
import connectionRequestRoutes from "./routes/connectionRequest.routes.js";
import userService from "./routes/userService.js";
// import starRoutes from './routes/aggregatePracticeRoutes.js'
import cors from "cors";


dotenv.config();


const app = express();
app.use(cors({
			origin     : "http://localhost:5173",
			credentials: true
		}
	)
)
app.use(express.json());
app.use(cookieParser());


app.use('/', userRoutes);
app.use('/', connectionRequestRoutes)
app.use('/', userService)
// app.use('/',starRoutes)


connect_db().then(() => {
	console.log('DB connected');
	app.listen(process.env.PORT, () => {
		console.log(`Server Listening on : http://localhost:${process.env.PORT}`)
	})
}).catch((e) => {
	console.log('database cannot be connected', e);
	process.exit(1);
})

