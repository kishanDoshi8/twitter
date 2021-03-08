const jwt = require("jsonwebtoken");
require("dotenv").config('../');

function auth(req, res, next) {
    const token = req.header('x-auth-token');

    // Check token
    if(!token) return res.status(401).json({ success: false, msg: 'Authorization denied' });

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.myJwtSecret);
    
        // Add user from payload
        req.user = decoded;
    
        next();
    } catch (error) {
        return res.status(400).json({ success: false, msg: 'Token is not valid' })
    }
}

module.exports = auth;