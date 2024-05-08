import { promises as fsPromises } from "fs";
import path from "path";

class FileManagementHelper {
	/**
	 * Default constructor.
	 * @memberOf FileManagementHelper
	 */
	constructor() {}


	readFile = async (filePath) => {
		try {
			const data = await fsPromises.readFile(filePath, "utf8");
			return data;
		} catch (error) {
			throw error;
		}
	};


	readDirectory = async (directoryPath) => {
		try {
			const files = await fsPromises.readdir(directoryPath);
			return files;
		} catch (error) {
			throw error;
		}
	};

	getContent = async (directoryPath) => {
		try {
			const files = await this.readDirectory(directoryPath);

			let concatenatedContent = "";

			for (const file of files) {
				const filePath = path.join(directoryPath, file);
				const fileContent = await this.readFile(filePath);
				concatenatedContent += `${file}:\n${fileContent}\n\n`;
			}

			return concatenatedContent;
		} catch (error) {
			console.error("Error reading directory:", error);
		}
	};

	addLineNumbers = async (filePath) => {
		try {

			const data = await this.readFile(filePath, "utf8");

			const lines = data.split("\n");

			const linesWithNumbers = lines.map(
				(line, index) => `${index + 1}: ${line}`
			);

			const numberedContent = linesWithNumbers.join("\n");

			await fsPromises.writeFile(filePath, numberedContent, "utf8");

			console.log("Line numbers added successfully!");

		} catch (err) {
			console.error(err);
		}
	};
}

export default FileManagementHelper;
