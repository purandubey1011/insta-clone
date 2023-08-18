const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // console.log(file);
        cb(null, "./public/images");
    },
    filename: function (req, file, cb) {
        console.log(req.user.username)
        let modifiedName =
        req.user.username + "-" + Date.now() + path.extname(file.originalname);
        cb(null, modifiedName);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        let filetypes = /jpeg|jpg|png|gif/;
        let mimetype = filetypes.test(file.mimetype);
        let extname = filetypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(
            "Error: File upload only supports the following filetypes - " +
                filetypes
        );
    },
});

module.exports = upload;
