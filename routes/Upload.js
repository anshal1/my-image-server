const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
router.use("/post", express.static("upload"));
const storage = multer.diskStorage({
    destination: "./upload",
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}_${file.originalname}`)
    }
})
const upload = multer({
    storage
})


router.post("/upload/image", upload.single("image"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(404).json({
                error: "Image not found"
            })
        }
        if (req.file.mimetype !== "image/jpeg" && req.file.mimetype !== "image/png" && req.file.mimetype !== "image/jpg") {
            fs.unlinkSync(`upload/${req.file.filename}`);
            return res.status(400).json({
                success: false,
                error: "Invalid valid, only JPEG, JPG, and PNG files are allowed"
            })
        }
        res.json({
            success: true,
            image_url: `http://localhost:5000/post/${req.file.filename}`,
            delete_id: req.file.filename
        })
    } catch (error) {
        if (error) {
            return res.status(500).json({
                success: false,
                error: "Internal server error"
            })
        }
    }
})
router.delete("/delete/image", async(req, res) => {
    try {
        const { delete_id } = req.body
        if (!delete_id) {
            return res.status(400).json({ error: "Delete id is required" });
        }
        const find_image = fs.existsSync(`upload/${delete_id}`);
        if (!find_image) {
            return res.status(404).json({ error: "Image not found" });
        }
        const Delete_image = fs.unlink(`upload/${delete_id}`, (result)=>{
            res.json({
                success: true,
                msg:"Image deleted"
            })
        });
    } catch (error) {
        if (error) {
            return res.status(500).json({
                success: false,
                error: "Internal server error"
            })
        }
    }
})


module.exports = router;