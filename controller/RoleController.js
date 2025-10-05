const DB = require(`../database/DB`);

const getRoles = async (req, res) => {
    try {
        const [rows] = await DB.query('SELECT * FROM Role');
        res.json({succes: true, data:rows});
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({succes:false, error: 'Internal Server Error' });
    }
};

const postRole = async (req, res) => {
    const  {name}  = req.body;
    try {
        const [result] = await DB.query('INSERT INTO Role (name) VALUES (?)', [name]);
        res.status(201).json({succes:true, message: 'Role created', roleId: result.insertId });
    } catch (error) {
        console.error('Error creating role:', error);
        res.status(500).json({succes:false, error: 'Internal Server Error' });
    } 
};

module.exports = {
    getRoles,
    postRole
};
