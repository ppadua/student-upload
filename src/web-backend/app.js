import express from "express";

const App = express();
const PORT = 8000;

App.use(express.json());
App.use(express.urlencoded({ extended: true }));

App.get("/", (req, res) => {
	res.send("Hello, World!");
});

App.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
