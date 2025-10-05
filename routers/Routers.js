const express = require('express');
const { getRoles, postRole } = require('../controller/RoleController');


const router = express.Router();


// Example route

// rouuters for Role
router.get('/roles',getRoles)
router.post('/role',postRole)


module.exports = router;
