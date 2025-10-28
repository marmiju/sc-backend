const DB = require(`../database/DB`);
const cloudinary = require('../config/Cloudinary');
const { sql } = require('../Utilities/db_sql');

const sharp = require('sharp');
const fs = require("fs");  //fs
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');




const CreateUser = async (req, res) => {
    const { email, name, password, phone, religion, address, birthDate, bloodgrp, education, joinDate, roleId, designation } = req.body;
    const file = req.file;
    console.log('Received file in CreateUser:', file);
    let profile_picture = null;
    try {

        const existingUser = await DB.query(sql.checkUserByemail, [email]);
        if (existingUser[0].length > 0) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        //  handling Image Upload
        if (req.file) {
            const outputPath = `uploads/${Date.now()}.webp`;
            await sharp(req.file.path)
                .resize({ width: 400 })
                .webp({ quality: 70 })
                .toFile(outputPath);

            const result = await cloudinary.uploader.upload(outputPath, {
                allowed_formats: ['jpg', 'jpeg', 'png', 'webp','heic'],
                folder: 'profile_pictures',
                resource_type: 'image'
            })
            profile_picture = result.secure_url;

            // unlick the files
            fs.unlinkSync(req.file.path);
            fs.unlinkSync(outputPath);
        }
        const hadsspasword = await bcrypt.hash(password, 10);


        const result = await DB.query(sql.CreateUser, [email, name, hadsspasword, phone, religion, address, birthDate, bloodgrp, education, joinDate, roleId, profile_picture, designation]);
        res.status(201).json({ success: true, message: "User created successfully",result: result[0] });

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ success: false, error: "Internal server error" });
        return;
    };


}

const SignIn = async (req, res) => {
    const { email, password } = req.body;
    try {

        const response = await DB.query(sql.GetUser, [email]);
        result = response[0];

        // check Email Are Correct or not
        if (result.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid Email" });
        }

        const user = result[0];
        // check Password validation
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid Password" });
        }
   
        // Generate JWT Token
        const token = jwt.sign(
            {
                id: user.id,
                name:user.name,
                email: user.email,
                role: user.role,
                profile_picture: user.profile_picture
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        const { password : pwd, ...data } = user;
        return res.status(200).json({ success: true,message: "User signed in successfully",data,token });
    } catch (error) {
        console.error('Error signing in user:', error);
        res.status(500).json({ success: false, error: "Internal server error" });
        return;
    }
}


module.exports = {
    CreateUser,
    SignIn
};

