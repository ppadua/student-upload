import OpenAIHelper         from "../helpers/openai.helper.js";

class ChatCompletion {
    #req;
    #res;
    
    constructor(req, res){
        this.#req = req;
        this.#res = res;
    }

    chat = async () => {
        let response_data = { status: false, result: "", message: "", error: null };
        try {

            if(this.#req?.body.prompt){
                let prompt = this.#req.body.prompt;

                let openAIHelper    = new OpenAIHelper();
                response_data       = await openAIHelper.chatCompletionAssistant(prompt);
            }
        }
        catch(error){
            console.error(error);
            this.#res.status(500).json({ error: "Internal Server Error" });
        }

        this.#res.json(response_data);
    }
}

export default ChatCompletion;