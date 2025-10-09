const DB = require("../../database/DB");
const cloudinary = require('../../config/Cloudinary');
const sharp = require('sharp');
const fs = require("fs");
const heicConvert = require('heic-convert'); // 👈 add this library

const UpdateUser = async (req, res) => {
    const id = req.params.id;
    const {
        email, name, phone, religion, address, birthDate, bloodgrp, education, joinDate, roleId, designation
    } = req.body;

    let profile_picture = req.file ? req.file.path : null;

    try {
        // Step 1️⃣: Build update fields dynamically
        const fieldsToUpdate = {};
        if (email) fieldsToUpdate.email = email;
        if (name) fieldsToUpdate.name = name;
        if (phone) fieldsToUpdate.phone = phone;
        if (religion) fieldsToUpdate.religion = religion;
        if (address) fieldsToUpdate.address = address;
        if (birthDate) fieldsToUpdate.birthDate = birthDate;
        if (bloodgrp) fieldsToUpdate.bloodgrp = bloodgrp;
        if (education) fieldsToUpdate.education = education;
        if (joinDate) fieldsToUpdate.joinDate = joinDate;
        if (roleId) fieldsToUpdate.roleId = roleId;
        if (designation) fieldsToUpdate.designation = designation;

        // Step 2️⃣: Handle profile picture (HEIC + resize + upload)
        if (req.file) {
            let inputPath = req.file.path;
            let tempPath = inputPath;

            // ✅ If HEIC/HEIF file, convert it first
            if (
                req.file.mimetype === 'image/heic' ||
                req.file.mimetype === 'image/heif' ||
                inputPath.toLowerCase().endsWith('.heic')
            ) {
                const buffer = fs.readFileSync(inputPath);
                const outputBuffer = await heicConvert({
                    buffer,
                    format: 'JPEG',
                    quality: 1
                });
                tempPath = inputPath.replace('.heic', '.jpg');
                fs.writeFileSync(tempPath, outputBuffer);
            }

            // ✅ Process image with Sharp
            const outputPath = `uploads/${Date.now()}.webp`;
            await sharp(tempPath)
                .resize({ width: 400 })
                .webp({ quality: 70 })
                .toFile(outputPath);

            // ✅ Upload to Cloudinary
            const result = await cloudinary.uploader.upload(outputPath, {
                folder: 'profile_pictures',
                resource_type: 'image',
                allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'heic']
            });

            profile_picture = result.secure_url;

            // ✅ Clean up temp files
            fs.unlinkSync(req.file.path);
            if (fs.existsSync(tempPath) && tempPath !== req.file.path) fs.unlinkSync(tempPath);
            fs.unlinkSync(outputPath);
        }

        if (profile_picture) fieldsToUpdate.profile_picture = profile_picture;

        // Step 3️⃣: Build SQL dynamically
        const setString = Object.keys(fieldsToUpdate)
            .map((key) => `${key} = ?`)
            .join(', ');
        const values = Object.values(fieldsToUpdate);

        if (values.length === 0) {
            return res.status(400).json({ success: false, error: "No fields to update" });
        }

        const sql = `UPDATE User SET ${setString} WHERE id = ?`;
        values.push(id);

        const [result] = await DB.query(sql, values);

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            result
        });

    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};

module.exports = { UpdateUser };
