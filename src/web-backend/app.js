import express from "express";
import BodyParser from "body-parser";

import Constants from "./configs/constants.js";
import Routes from "./routes/routes.js";

const App = express();

App.use(BodyParser.json({ limit: "50mb" }));
App.use(BodyParser.urlencoded({ limit: "50mb", extended: true }));

App.use("/", Routes);

App.listen(Constants.APP_SETTINGS.port, () => {
	console.log(
		`Server is now running on http://localhost:${Constants.APP_SETTINGS.port}`
	);
});
