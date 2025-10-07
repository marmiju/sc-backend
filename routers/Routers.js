const express = require('express');
const { getRoles, postRole } = require('../controller/RoleController');
const { CreateUser, SignIn } = require('../controller/AuthController');
const upload = require('../midleware/multer');


const router = express.Router();


// Example route

// routers for Role
router.get('/roles',getRoles);
router.post('/role',postRole);

// rouuters for User
router.post('/createUser', upload.single('profile_picture'), CreateUser);
router.post('/signin', SignIn);




module.exports = router;
