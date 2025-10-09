const roles = {
    1: 'admin',
    2: 'teacher',
    3: 'stuff',
    4: 'editor'

}

// Table Names
const table = {
    rols: 'Role',
    users: `User`
}

const sql = {
    CreateUser: `INSERT INTO User (email, name, password, phone, religion, address, birthDate,  bloodgrp, education, joinDate, roleId, profile_picture,designation) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    GetUser: `select u.id, u.email, u.password, r.name as role from  ${table.users} as u JOIN ${table.rols} as r on u.roleId = r.id where email = ?`,
    checkUserByemail: `select * from User where email = ?`,
    getAllUSer: `select u.*, r.name as role, u.profile_picture from  ${table.users} as u JOIN ${table.rols} as r on u.roleId = r.id`,
    getByRole: `select u.*, r.name as role from User as u JOIN Role as r on u.roleId = r.id where u.roleId =?`,
    getUser : `select *, r.name as role from User as u join Role as r on u.roleId = r.id where u.id = ?`
    
}


module.exports = {
    roles,
    table,
    sql
};

return;
