import OpenAIHelper from "../helpers/openai.helper.js";

class ChatCompletion {
    constructor() {
    }

    /* TODO : ADD CSS FILE TO CHECK */
    chat = async (req, res) => {
        let response_data = { status: false, result: "", message: "", error: null };
        try {
            let html_file = req.files[0].path; //html depends


            if (html_file) {
                let openAIHelper = new OpenAIHelper();
                let messages = [
                    {
                        role: "system",
                        content: `
                            You are CodeReviewBot, an automated checker to review the code given by the user. \
                            Use HTML5 Structure: Start with the basic structure of an HTML5 document.	\
                            Use Lowercase: Although HTML is case-insensitive, it's a good practice to use lowercase for HTML tags and attributes for consistency and readability.	 \
                            Use Semantic Tags: Use semantic HTML tags to structure the content logically.	 \
                            Use Proper Indentation of 4 spaces or 1 tab	 \
                            Use Comments: Add comments to explain different sections of the code: \	
                            Avoid Inline Styles: Separate the styling into an external CSS file. \
                            Avoid Redundant Nested Tags: Avoid unnecessary nesting of HTML tags. Each tag should serve a specific purpose, and nesting should be kept to a minimum to maintain simplicity and clarity. \
                            Generate a response in a calm and friendly manner, with a focus on maintaining a positive and approachable tone. Use bullet points to clearly outline the changes needed to help organize information more effectively, making it easier for the reader to understand and follow. Additionally, avoid directly mentioning the instructions, but rather explain the reasons behind the suggested improvements to foster clarity and encourages comprehension.\
                        `
                    },
                    { role: "user", content: `Check the following HTML code for good practices:\n\n${html_file}\n\n Suggestions for improving the HTML code:` }, // file readfile 
                ]
                response_data = await openAIHelper.chatCompletionAssistant(messages);

                console.log(response_data)
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }

        res.json(response_data);
    }
}

export default (function chat() {
    return new ChatCompletion();
})();
