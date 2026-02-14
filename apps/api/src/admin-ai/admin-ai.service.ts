import { Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { OpenAiService } from '../openai/openai.service';
import { ContentService } from '../content/content.service';

@Injectable()
export class AdminAiService {
  constructor(private openai: OpenAiService, private content: ContentService) {}

  private guardPrompt(input: string) {
    if (/personal data|violence|adult/i.test(input)) throw new BadRequestException('Prompt out of policy');
  }

  async generateConcept(adminId: string, body: Record<string, string>) {
    const prompt = `Primary education only. Generate concept draft in ${body.lang}. Goal: ${body.learningGoal}. Constraints: ${body.constraints}`;
    this.guardPrompt(prompt);
    const text = await this.openai.generateText(prompt, '{title,story,content,suggestions[]}');
    const moderation = await this.openai.moderateText(text);
    if (moderation.flagged) throw new BadRequestException('Moderation blocked output');
    return this.content.saveDraftConcept({ ...JSON.parse(text), dateKey: new Date().toISOString().slice(0, 10), status: 'draft', moderationResult: moderation, createdBy: new Types.ObjectId(adminId) });
  }

  async generateExercises(adminId: string, body: Record<string, unknown>) {
    const prompt = `Primary education only. Generate ${body.n} exercises for concept ${body.conceptId} types ${body.types}.`;
    const text = await this.openai.generateText(prompt, '[{type,prompt,options,answer,explanation}]');
    const moderation = await this.openai.moderateText(text);
    if (moderation.flagged) throw new BadRequestException('Moderation blocked output');
    return this.content.saveDraftExercises((JSON.parse(text) as Record<string, unknown>[]).map((it) => ({ ...it, conceptId: body.conceptId, status: 'draft', moderationResult: moderation, createdBy: new Types.ObjectId(adminId) })));
  }

  async rewriteExplanation(adminId: string, body: Record<string, string>) {
    const prompt = `Rewrite for grade ${body.targetGradeBand} in ${body.lang}: ${body.text}`;
    const text = await this.openai.generateText(prompt, '{text}');
    const moderation = await this.openai.moderateText(text);
    if (moderation.flagged) throw new BadRequestException('Moderation blocked output');
    return { text, moderation, adminId };
  }
}
