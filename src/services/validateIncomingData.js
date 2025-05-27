
export const validateRegisterData = ({firstName, emailId, password}) => {
if(!firstName || !emailId || !password ){
	throw new Error("Some mandatory fields are blank ..")
	}
}

export const validateLoginData = (emailId, password) => {
	if(!emailId || !password ){
		throw new Error(" mandatory fields are blank ..")
	}
}

