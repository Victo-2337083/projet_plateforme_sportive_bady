import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import rateLimit from 'express-rate-limit';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminAiService } from './admin-ai.service';

@Controller('admin/ai')
@UseGuards(JwtAuthGuard)
@Roles('admin')
export class AdminAiController {
  constructor(private readonly ai: AdminAiService) {}

  @Post('generate-concept')
  generateConcept(@Req() req: { user: { userId: string } }, @Body() body: Record<string, string>) {
    return this.ai.generateConcept(req.user.userId, body);
  }

  @Post('generate-exercises')
  generateExercises(@Req() req: { user: { userId: string } }, @Body() body: Record<string, unknown>) {
    return this.ai.generateExercises(req.user.userId, body);
  }

  @Post('rewrite-explanation')
  rewrite(@Req() req: { user: { userId: string } }, @Body() body: Record<string, string>) {
    return this.ai.rewriteExplanation(req.user.userId, body);
  }
}
