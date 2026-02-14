import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProgressService } from './progress.service';

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progress: ProgressService) {}

  @Post('result')
  setResult(@Req() req: { user: { userId: string } }, @Body() body: { exerciseId: string; wasCorrect: boolean }) {
    return this.progress.updateExerciseResult(req.user.userId, body.exerciseId, body.wasCorrect);
  }
}
