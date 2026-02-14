import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ContentService } from './content.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class ContentController {
  constructor(private readonly content: ContentService) {}

  @Get('today')
  today() { return this.content.today('fr'); }

  @Get('session')
  session() { return this.content.session('fr'); }

  @UseGuards(JwtAuthGuard)
  @Get('review')
  review(@Req() req: { user: { userId: string } }) { return this.content.reviewDue(req.user.userId); }

  @Get('badges')
  badges() { return [{ id: 'kind-learner', label: 'Curieux du jour' }]; }

  @Post('admin/drafts/:id/publish')
  publish(@Param('id') id: string) { return this.content.publishDraft(id); }
}
