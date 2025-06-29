import jwt from 'jsonwebtoken';


export const authenticateUser = async (userId)=>{
	const jwtToken=await jwt.sign({userId},process.env.JWT_SECRET,{expiresIn: '1d'});
	return jwtToken;
}