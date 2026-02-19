import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { google } from '@ai-sdk/google';
import { tools } from './tools';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  //TODO TASK 1
 const context = `
You are a campus navigation assistant for Anna University.

You help students and visitors find departments, classrooms, labs, and offices inside the campus.

Your service is available only between 8:30 AM and 4:30 PM.

If a user asks for directions outside this time, politely inform them that campus guidance service is available only from 8:30 AM to 4:30 PM.

Provide clear and simple step-by-step walking directions using landmarks.
Keep responses short and practical.
`;

  
  const systemPrompt = `
You are an Anna University Campus Guide Assistant.

Your responsibilities:
- Guide users from the main gate or any known campus location to departments or classrooms.
- Provide step-by-step walking directions.
- Mention nearby landmarks to make navigation easier.
- Use simple and clear sentences.

Important Rule:
- Provide guidance only between 8:30 AM and 4:30 PM.
- If the current time is outside this range, politely inform the user that the navigation service is available only from 8:30 AM to 4:30 PM.

Stay focused only on campus navigation.
Do not provide unrelated information.
`;

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),

    //TODO TASK 2 - Tool Calling
    // tools,            // Uncomment to enable tool calling
    // maxSteps: 5,      // Allow multi-step tool use (model calls tool → gets result → responds)
  });

  return result.toUIMessageStreamResponse();
}
