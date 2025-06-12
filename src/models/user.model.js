import mongoose from "mongoose";
import validator from "validator";


const userSchema = new mongoose.Schema({
	firstName: {
		type     : String,
		required : true,
		lowercase: true,
		trim     : true,
		minLength: 3,
		maxLength: 60
	},
	lastName : {
		type     : String,
		lowercase: true,
		trim     : true
	},
	emailId  : {
		type     : String,
		required : true,
		unique   : true,
		lowercase: true,
		trim     : true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error("Email is not valid..")
			}
		}
	},
	password : {
		type     : String,
		trim     : true,
		minLength: 8,
		validate(value) {
			if (!validator.isStrongPassword(value, [{minUppercase: 1}])) {
				throw new Error("Password is not Strong..")
			}
		}
	},
	age      : {
		type: Number,
		min : 18
	},
	gender   : {
		type: String,
		enum: ['male', 'female', 'others'],
		validate(value) {
			if (!['male', 'female', 'others'].includes(value)) {
				throw new Error('Gender data is not valid')
			}
		}
	},
	photoUrl : {
		type   : String,
		default: "https://cdn-icons-png.flaticon.com/512/196/196369.png",
		validate(value) {
			if (!validator.isURL(value)) {
				throw new Error('Photo URL is not valid', value)
			}
		}
	},
	about    : {
		type   : String,
		default: "Please enter something about yourself.."
	},
	skills   : {
		type: [String],
		validate(value) {
			if (value.length > 7) {
				console.log(value)

				throw new Error('Only 7 skills allowed')
			}
		}
	}
}, {timestamps: true});

userSchema.pre("save", async function (next) {
	const user = this;
	if (user.skills.includes('captain')) {
		user.firstName = 'CAPTAIN 🏏' + user.firstName;
	}
	next();
})

const User = mongoose.model('User', userSchema);
export default User;