const jwt = require('jsonwebtoken');

const isAuthentication = (req, res, next) => {
    const input = req.headers['authorization'];

    try{
        const token = input && input.split(' ')[1]; // Bearer <token>
        // check token empty or not
        if (!token)  return res.status(401).json({ success: false, message: "No token provided" });
        const user = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = user;
        next();

      
    }catch(error){
        console.error('Error verifying token:', error);
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
 
}


module.exports = {
    isAuthentication
};