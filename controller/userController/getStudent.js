
const DB = require('../../database/DB');
const { sql } = require('../../Utilities/db_sql');



const getUser= async (req,res)=>{

    try{ 
        const [rows] = await DB.query(sql.getUser, [req.params.id]);
        if(rows.length === 0){
            return res.status(404).json({success:false, message: "User not found"});
        }
        const {password, ...user} = rows[0];
        res.status(200).json({success:true, user});
    }catch(error){
        console.error('Error fetching user:', error);
        return res.status(500).json({ success: false, error: "Internal server error"});
       
    }
}

module.exports = getUser;