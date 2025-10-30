const express = require('express');
const { getRoles, postRole } = require('../controller/RoleController');
const { CreateUser, SignIn } = require('../controller/AuthController');
const upload = require('../midleware/multer');
const {isAdmin_editor} = require('../midleware/isAdmin');
const { isAuthentication } = require('../midleware/isAuthentication');
const { GetAllUser, getUserByRole } = require('../controller/userController/GetUser');
const getUser = require('../controller/userController/getStudent');
const { UpdateUser } = require('../controller/userController/UpdateUser');
const deleteUser = require('../controller/userController/deletUser');


const router = express.Router();


// Example route

// routers for Role
router.get('/roles',getRoles);
router.post('/role',postRole);

// rouuters for Athentication
router.post('/createUser', isAdmin_editor, upload.single('profile_picture'), CreateUser);
router.post('/signin', SignIn);

// Contoll User
router.get('/getUsers',GetAllUser )
router.get('/getUsers/:roleId', getUserByRole) // get User By Role like Teacher Stuff and more
router.get('/getUser/:id', getUser);
router.put('/updateUser/:id', isAuthentication, isAdmin_editor, upload.single('profile_picture'), UpdateUser);
router.delete('/user/:id', isAdmin_editor, deleteUser);

module.exports = router;
