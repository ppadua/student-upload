import FileManagementHelper from "../helpers/file_management.helper.js";
import OpenAIHelper from "../helpers/openai.helper.js";
import fs from "fs";
class ChatCompletion {
	constructor() {}

	readFileAsync(filePath) {
		return new Promise((resolve, reject) => {
			fs.readFile(filePath, "utf8", (err, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
	}
	/* TODO : ADD CSS FILE TO CHECK */
	chat = async (req, res) => {
		let response_data = {
			status: false,
			result: "",
			message: "",
			error: null,
		};
		try {
			let upload_files = req.files; //html depends
			console.log("upload_files", upload_files);
			let html_upload_file =
				upload_files[0].originalname.indexOf(".html") > 0
					? upload_files[0].path
					: upload_files[1].path; //html depends
			let css_upload_file =
				upload_files[0].originalname.indexOf(".css") > 0
					? upload_files[0].path
					: upload_files[1].path; //html depends

			let fileManagementHelper = new FileManagementHelper();
			await fileManagementHelper.addLineNumbers(html_upload_file);
			await fileManagementHelper.addLineNumbers(css_upload_file);

			console.log("html_upload_file", html_upload_file);
			if (html_upload_file && css_upload_file) {
				let html_file = await this.readFileAsync(html_upload_file);
				let css_file = await this.readFileAsync(css_upload_file);
				let openAIHelper = new OpenAIHelper();

				let system_prompt = `
                You are CodeReviewBot, an automated checker to review the code given by the user.
                Review the code and ensure it adheres to the provided instructions. You should meticulously examine the code, checking for compliance with each instruction. Thoroughness and accuracy are crucial in this review process. Use bullet points to clearly outline the changes needed to help organize information more effectively, making it easier for the reader to understand and follow. Specify the name of the file to make the changes. Always specify the html tag or css selector to change and always identify its line number. Additionally, avoid directly mentioning the instructions, do not include a modified code but rather explain the reasons behind the suggested improvements to foster clarity and encourages comprehension. If the code follows all the instructions, simplay say 'All good'
                `;

				let html_instructions_prompt = `
                HTML Instructions:	
                -Use Lowercase: Although HTML is case-insensitive, it's a good practice to use lowercase for HTML tags and attributes for consistency and readability.	
                -Use Semantic Tags: Use semantic HTML tags to structure the content logically.	
                -Use Proper Indentation.
                -Avoid Inline Styles: Separate the styling into an external CSS file.	
                -Avoid Redundant Nested Tags: Avoid unnecessary nesting of HTML tags. Each tag should serve a specific purpose, and nesting should be kept to a minimum to maintain simplicity and clarity.	
                -Avoid text hanging. Enclose all text content within appropriate HTML tags tcss_upload_fileo maintain a structured document.	
                -Readable id and class name for each HTML elements	
                `;

				let css_instructions_prompt = `
                CSS Instructions:	
                -Choose descriptive and meaningful names for IDs and classes.	
                -Use Semicolons: End each CSS property declaration with a semicolon to ensure proper syntax	
                -Organize Stylesheets: Structure the CSS code logically and consistently. One common approach is to group styles by element or module.	
                -Alphabetical Order: Arrange the  CSS properties alphabetically within each selector. This makes it easier to find and manage properties.	
                -Avoid Duplicate IDs and Classes.	
                -Avoid Unused CSS: Remove any CSS rules that are not being used in the HTML. Unused CSS adds unnecessary file size and can clutter the stylesheet.	
                `;
				let messages = [
					{
						role: "system",
						content: system_prompt,
					},
					{
						role: "user",
						content: `Check the following HTML code for good practices:\n\n${html_file}\n\n Refer to this HTML instructions: ${html_instructions_prompt}`,
					}, // file readfile
					{
						role: "user",
						content: `Check the following css code for good practices:\n\n${css_file}\n\n Refer to this HTML instructions: ${css_instructions_prompt}`,
					}, // file readfile
				];
				response_data = await openAIHelper.chatCompletionAssistant(
					messages
				);

				if (response_data.status) {
				    const uploadedPaths = req.files.map(file => file.path);

				    // Remove each uploaded file
				    uploadedPaths.forEach(filePath => {
				        fs.unlink(filePath, err => {
				            if (err) {
				                console.error('Error removing file:', err);
				            } else {
				                console.log('File removed successfully:', filePath);
				            }
				        });
				    });
				}
				// console.log(response_data)
			}
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal Server Error" });
		}

		res.json(response_data);
	};
}

export default (function chat() {
	return new ChatCompletion();
})();
