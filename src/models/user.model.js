import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
	firstName: {
		type    : String,
		required: true,
	},
	lastName : {
		type: String,
	},
	emailId  : {
		type  : String,
		unique: true,
	},
	password : {
		type: String,
	},
	age      : {
		type: Number,
	},
	gender   : {
		type: String,
		enum: ['male', 'female', 'others']
	}
}, {timestamps: true});

const User = mongoose.model('User', userSchema);
export default User;