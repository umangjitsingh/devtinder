import mongoose from "mongoose";


const connect_db = async () => {
   await mongoose.connect(process.env.MONGODB_URI)
}
export default connect_db;