const jwt = require('jsonwebtoken');

const isAdmin = (req, res, next) => {
    const input = req.headers['authorization'];

    try{
        const token = input && input.split(' ')[1]; // Bearer <token>
        // check token empty or not
        if (!token)  return res.status(401).json({ success: false, message: "No token provided" });
        const user = jwt.verify(token, process.env.JWT_SECRET);
        if(user.role !== 'admin') return res.status(403).json({ success: false, message: "Access denied. Admins only."});
        req.user = user;
        next();
      
    }catch(error){
        console.error('Error verifying token:', error);
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
 
}

const isAdmin_editor = (req, res, next) => {
    const input = req.headers['authorization'];
    try{
        const token = input && input.split(' ')[1]; // Bearer <token>
        // check token empty or not
        if (!token)  return res.status(401).json({ success: false, message: "No token provided" });
        const user = jwt.verify(token, process.env.JWT_SECRET);
        
        if(user.role !== 'admin' && user.role !== 'editor' ) return res.status(403).json({ success: false,  message: "Access denied.You Need to be Admin or Editor."  });
        req.user = user;
        next();
      
    }catch(error){
        console.error('Error verifying token:', error);
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
}



module.exports = {
    isAdmin,
    isAdmin_editor
};