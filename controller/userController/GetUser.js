const DB = require('../../database/DB');
const { sql } = require('../../Utilities/db_sql');

const GetAllUser = async (req, res) => {
    try{
        const [rows] = await DB.query(sql.getAllUSer);

        // Remove password from every user in the result
        const users = rows.map(({password, ...user}) => user);
        res.status(200).json({success:true, users: users});

    }catch(error){
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, error: "Internal server error"});
        return;
    }
}

const getUserByRole = async (req, res) => {
  const { roleId } = req.params;
  try {
    const [rows] = await DB.query(sql.getByRole, [roleId]);

    // Remove password from every user in the result
    const users = rows.map(({ password, ...user }) => user);

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users by role:', error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};


module.exports = {
    GetAllUser,
    getUserByRole
};