import jwt from "jsonwebtoken";

const generateRefreshToken = (admin) => {
    return jwt.sign(
        {
            id: admin._id,
            tokenVersion: admin.tokenVersion,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE || "7d",
        },
    );
};

export default generateRefreshToken;
