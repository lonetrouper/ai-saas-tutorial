import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionSystemMessageParam } from "openai/resources/index.mjs";
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";

const openai = new OpenAI({
  // apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
  apiKey: process.env["OPENAI_SERVICE_ACCOUNT_API_KEY"], // This is the default and can be omitted
});


const instructionMessage: ChatCompletionSystemMessageParam = {
  content: "You are a code generator. Add code in markdown. Use code comments for explanation. Give some text explanation as well.",
  role: "system",
};
export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!openai.apiKey) {
      return new NextResponse("OpenAI API key not found", { status: 401 });
    }
    if (!body) {
      return new NextResponse("Messages not found", { status: 400 });
    }
    const freeTrial = await checkApiLimit();

    if (!freeTrial) {
      return new NextResponse("Free trial has expired.", { status: 403 });
    }
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [instructionMessage, ...body],
      stream: false
    });
    await increaseApiLimit();

    return NextResponse.json(response.choices[0].message);
  } catch (error) {
    console.log("[CODE_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
