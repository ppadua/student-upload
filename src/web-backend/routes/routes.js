import express from "express";
import multer from "multer";

import ChatCompletion from "../controllers/chat_completion.controller.js";
const router = express.Router();

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/")
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + "-" + file.originalname)
	},
})
const uploadStorage = multer({ storage: storage })

router.post("/student_upload", uploadStorage.array("files", 10), ChatCompletion.chat);

router.get("/", (req, res) => {
	// res.json("Hello, World!");
	res.render("../views/upload")
});


export default router;
