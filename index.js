import "dotenv/config"
import readline from "readline"
import { ChatMistralAI } from "@langchain/mistralai"
import { HumanMessage } from "@langchain/core/messages";

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const model = new ChatMistralAI({
    model: "mistral-small-latest",
})

const messages = []


// ... same imports ...
while (true) {
    const userInput = await new Promise(resolve => rl.question("\x1b[32mYou:\x1b[0m ", resolve))

    messages.push(new HumanMessage(userInput))

    const response = await model.invoke(messages)

    messages.push(response)

    console.log(`\x1b[34mAI:\x1b[0m ${response.content}`)
}


rl.close()