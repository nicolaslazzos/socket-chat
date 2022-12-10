import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateMemberDto } from '../dtos/create-member.dto';
import { MembersService } from '../services/members.service';
import { Member, MemberRole } from '../entities/member.entity';
import { Roles } from '../role.decorator';
import { RolesGuard } from '../role.guard';

@Controller('members')
@UseGuards(AuthGuard())
export class MembersController {
  constructor(private readonly membersService: MembersService) { }

  @Post()
  @Roles(MemberRole.ADMIN)
  @UseGuards(RolesGuard)
  createMembers(@Body() { chat, members }: { chat: string; members: CreateMemberDto[]; }): Promise<Member[]> {
    return this.membersService.createMembers(chat, members);
  }
}
