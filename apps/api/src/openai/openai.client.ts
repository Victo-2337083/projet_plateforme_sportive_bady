import OpenAI from 'openai';

export const createOpenAiClient = (apiKey: string) => new OpenAI({ apiKey });
