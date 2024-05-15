import { OpenAI } from "openai";
import constants from "../configs/constants.js";

class OpenAIHelper {
    /**
    * Default constructor.
    * @memberOf OpenAIHelper
    */
    constructor() {
    }

    /**
    * DOCU: This helper will send a chat completion request with the custom prompt to the OpenAI GPT model. <br>
    * Triggered: . <br>
    * @async
    * @param {string} prompt - Requires a string text as prompt.
    * @returns {object} response_data { status: true, result: {chat_completion}, message: "", error: null }.
    * @memberOf FileManagementHelper 
    * @author Aaron
    */
    chatCompletionAssistant = async (messages = []) => {
        let response_data = { status: false, result: "", message: "", error: null };

        // return new Promise(async (resolve, reject) => {
        try {
            console.log(messages)
            /* Check if custom prompt is provided */
            if (messages) {

                /* Create an instance of the OpenAI class with the provided API key */
                let open_ai = new OpenAI(constants.OPEN_AI);

                let chat_completion = await open_ai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    max_tokens: 2000,
                    messages
                });

                /* Check if the response from OpenAI contains valid data */
                if (Object.keys(chat_completion).length && chat_completion?.choices && chat_completion.choices.length) {
                    response_data.status = true;
                    response_data.result = chat_completion;

                }
                else {
                    response_data.error = chat_completion.error;
                }
            }
            else {
                response_data.message = "Missing required prompt field. Failed to send a chat completion request."
            }
        }
        catch (error) {
            response_data.error = error;
            response_data.message = "An error encountered while trying to send a request to chat assistant. Failed to send the request to chat assistant";
        }

        return response_data;

        // });
    }
}

export default OpenAIHelper;