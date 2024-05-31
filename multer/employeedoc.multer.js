const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/employeedoc"));
  },
  filename: async function (req, file, cb) {
    let fileName = file.originalname;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
