import "dotenv/config"
import readline from "readline"
import { ChatMistralAI } from "@langchain/mistralai"
import { tool, createAgent } from "langchain";
import { HumanMessage } from "@langchain/core/messages";
import { sendEmail } from "./mail.service.js";
import * as z from "zod"

const emailTool = tool(
    sendEmail,
    {
        name: "emailTool",
        description: "Use this tool to send an email",
        schema: z.object({
            to: z.string().describe("The recipient's email address"),
            html: z.string().describe("The HTML content of the email"),
            subject: z.string().describe("The subject of the email")
        })
    }
)

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const model = new ChatMistralAI({
    model: "mistral-small-latest",
})

const messages = []

const agent = createAgent({
    model,
    tools: [ emailTool ]
})


// ... same imports ...
while (true) {
    const userInput = await new Promise(resolve => rl.question("\x1b[32mYou:\x1b[0m ", resolve))

    messages.push(new HumanMessage(userInput))

    const response = await agent.invoke({
        messages
    })

    messages.push(response.messages[response.messages.length - 1])

    console.log(`\x1b[34mAI:\x1b[0m ${response.messages[ response.messages.length -1].content}`)
}


rl.close()