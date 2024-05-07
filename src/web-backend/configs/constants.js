import { config } from "dotenv";
config();

let constants = {};

constants.APP_SETTINGS = {
	app_name: "student-upload",
	port: 8000,
};

constants.OPEN_AI = {
	apiKey: process.env.OPEN_AI_API_KEY,
	organization: process.env.OPEN_AI_ORGANIZATION_ID,
};

export default constants;
