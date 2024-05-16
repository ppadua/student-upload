import FileManagementHelper from "../helpers/file_management.helper.js";
import OpenAIHelper from "../helpers/openai.helper.js";
import PromptMessage from "../configs/file_prompts.js";
import fs from "fs";
class ChatCompletion {
    constructor() { }

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
        let response_data = { status: false, result: "", message: "", error: null };

        try {
            let upload_files = req.files;
            let fileManagementHelper = new FileManagementHelper();
            let messages = [{
                role: "system",
                content: PromptMessage.FILE_PROMPT.SYSTEM.INSTRUCTION
            }];

            for (let index in upload_files) {
                let upload_file = upload_files[index];

                let file_type = (upload_file.originalname.indexOf(".html") ? `HTML` :
                    (upload_file.originalname.indexOf(".css") ? `CSS` :
                        (upload_file.originalname.indexOf(".js")) ? `JS` : null));

                if (file_type) {
                    await fileManagementHelper.addLineNumbers(upload_file);

                    messages.push({
                        role: "user",
                        content: `Check the following ${file_type} code for good practices:\n\n${upload_file}\n\n Refer to this ${file_type} instructions: ${PromptMessage.FILE_PROMPT[file_type].INSTRUCTION}`
                    })
                }
            }

            if (messages.length > 1) {
                let openAIHelper = new OpenAIHelper();

                response_data = await openAIHelper.chatCompletionAssistant(messages);

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
