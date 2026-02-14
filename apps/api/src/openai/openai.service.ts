import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createOpenAiClient } from './openai.client';

@Injectable()
export class OpenAiService {
  private client = createOpenAiClient(this.config.get('OPENAI_API_KEY', ''));
  constructor(private config: ConfigService) {}

  async generateText(prompt: string, schemaHint: string) {
    return this.withRetry(async () => {
      const result = await Promise.race([
        this.client.responses.create({
          model: this.config.get('OPENAI_TEXT_MODEL', 'gpt-4o-mini'),
          input: `${prompt}\nRespect schema: ${schemaHint}`
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 15000))
      ]);
      // @ts-expect-error SDK structure
      return result.output_text as string;
    });
  }

  async moderateText(text: string) {
    const moderation = await this.client.moderations.create({
      model: this.config.get('OPENAI_MODERATION_MODEL', 'omni-moderation-latest'),
      input: text
    });
    return moderation.results[0];
  }

  private async withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
    let err: unknown;
    for (let i = 0; i <= retries; i++) {
      try {
        return await fn();
      } catch (error) {
        err = error;
      }
    }
    throw new ServiceUnavailableException(`OpenAI call failed: ${String(err)}`);
  }
}
