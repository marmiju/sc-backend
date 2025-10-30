const DB = require('../../database/DB');
const { sql } = require('../../Utilities/db_sql');

const deleteUser = async (req, res) => {
  const { id } = req.params; 
  const user = req.user
  if (user.id == id) return res.status(500).json({ success:false, message: "You can't delete Your own Account" });

  if (!id) {
    return res.status(400).json({ error: "User id is required" });
  }

  try {
    const result = await DB.query(sql.deletuser, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, error: "Server error" });
  }
};

module.exports = deleteUser;
