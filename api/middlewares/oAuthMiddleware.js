const axios = require("axios");

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        const response = await axios.get(
            `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`
        );
        req.user = response.data;
        next();

    } catch (error) {
        console.error("Token verify error:", error.response?.data || error.message);
        return res.status(401).json({ message: "Invalid or expired Google access token" });
    }
};