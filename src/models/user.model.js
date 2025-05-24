import mongoose from "mongoose";


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
		trim     : true

	},
	password : {
		type: String,
		trim: true
	},
	age      : {
		type: Number,
		min : 18
	},
	gender   : {
		type: String,
		enum: ['male', 'female', 'others'],
		validate(value){
			if(!['male', 'female', 'others'].includes(value)){
				throw new Error('Gender data is not valid')
			}
		}
	},
	photoUrl : {
		type   : String,
		default: "https://cdn-icons-png.flaticon.com/512/196/196369.png"
	},
	about    : {
		type   : String,
		default: "Please enter something about yourself.."
	},
	skills   : {
		type: [String],
		validate(value){
			if(value.length > 7){
				console.log(value)

				throw new Error('Only 7 skills allowed')
			}
		}
	}
}, {timestamps: true});

const User = mongoose.model('User', userSchema);
export default User;