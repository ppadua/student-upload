import express from "express";
import ChatCompletion from "../controllers/chat_completion.controller.js";
const router = express.Router();

router.post("/", (req, res) => {
	const data = req.body;
	res.json(data);
});

router.get("/", (req, res) => {
	res.json("Hello, World!");
});

router.post("/chat", (req, res) => {
	new ChatCompletion(req, res).chat();
});
export default router;
