import mongoose from 'mongoose';


const connectionRequestSchema = new mongoose.Schema({
	fromUserId  : {
		type: mongoose.Schema.Types.ObjectId,
		ref:'User',
		required:true
	},
	toUserId: {
		type: mongoose.Schema.Types.ObjectId,
		ref:'User',
		required:true
	},
	status    : {
		type: String,
		required:true,
		enum: {
			values : ['pass', 'like', 'accepted', 'rejected'],
			message: `{VALUE} is not a valid status type.`
		}
	}
}, {timestamps: true});

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);
export default ConnectionRequest;