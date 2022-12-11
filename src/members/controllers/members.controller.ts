import { Controller, Post, Get, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateMemberDto } from '../dtos/create-member.dto';
import { MembersService } from '../services/members.service';
import { Member, MemberRole } from '../entities/member.entity';
import { Roles } from '../../common/role.decorator';
import { RolesGuard } from '../../common/role.guard';
import { UpdateMemberDto } from '../dtos/update-member.dto';

@Controller('members')
@UseGuards(AuthGuard())
export class MembersController {
  constructor(private readonly membersService: MembersService) { }

  @Post()
  @Roles(MemberRole.ADMIN)
  @UseGuards(RolesGuard)
  createMembers(@Body() { chat, members }: { chat: string; members: CreateMemberDto[]; }): Promise<Member[]> {
    return this.membersService.create(chat, members);
  }

  @Get()
  @Roles(MemberRole.MEMBER)
  @UseGuards(RolesGuard)
  getMembers(@Query('chat') chat: string): Promise<Member[]> {
    return this.membersService.findByChat(chat);
  }

  @Get('/:member')
  @Roles(MemberRole.MEMBER)
  @UseGuards(RolesGuard)
  getMember(@Param('member') member: string): Promise<Member> {
    return this.membersService.findById(member);
  }

  @Patch('/:member')
  @Roles(MemberRole.ADMIN)
  @UseGuards(RolesGuard)
  updateMember(@Param('member') member: string, @Body() dto: UpdateMemberDto): Promise<Member> {
    return this.membersService.updateById(member, dto);
  }

  @Delete('/:member')
  @Roles(MemberRole.ADMIN)
  @UseGuards(RolesGuard)
  deleteMember(@Param('member') member: string): Promise<Member> {
    return this.membersService.deleteById(member);
  }
}
