import prisma from "../db/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthenticationError } from "../middleware/errorHandler.js";

export const loginUser = async ({email, password}) => {
    const user = await prisma.user.findUnique({where: {email}});
    if(!user) throw new AuthenticationError("Unauthorized");
    if(await bcrypt.compare(password, user.password) === false) throw new AuthenticationError("Unauthorized");

    const token = jwt.sign(
        {userId: user.id, email: user.email},
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
    const {password:_, ...sanitizeUser} = user;
    return {token, sanitizeUser}; 

};
