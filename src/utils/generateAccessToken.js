import jwt from "jsonwebtoken";

const generateAccessToken = (admin) => {
    return jwt.sign(
        {
            id: admin._id,
            role: admin.role,
            tokenVersion: admin.tokenVersion,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE || "15m",
        },
    );
};

export default generateAccessToken;
