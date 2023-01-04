import { Controller, Post, Get, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateMemberDto } from '../dtos/create-member.dto';
import { MembersService } from '../services/members.service';
import { Member, MemberRole } from '../entities/member.entity';
import { Roles } from '../../common/decorators/roles.decorator';
import { UpdateMemberDto } from '../dtos/update-member.dto';
import { MembersRolesGuard } from '../members-roles.guard';
import { GetUser } from '../../auth/get-user.decorator';
import { User } from '../../auth/entities/user.entity';

@Controller('members')
@UseGuards(AuthGuard())
export class MembersController {
  constructor(private readonly membersService: MembersService) { }

  @Post()
  @Roles(MemberRole.ADMIN)
  @UseGuards(MembersRolesGuard)
  createMembers(@Body() { chat, members }: { chat: string; members: CreateMemberDto[]; }): Promise<Member[]> {
    return this.membersService.create(chat, members);
  }

  @Get()
  @Roles(MemberRole.MEMBER)
  @UseGuards(MembersRolesGuard)
  getMembers(@Query('chat') chat: string): Promise<Member[]> {
    return this.membersService.findByChat(chat);
  }

  @Get('/:member')
  @Roles(MemberRole.MEMBER)
  @UseGuards(MembersRolesGuard)
  getMember(@Param('member') member: string): Promise<Member> {
    return this.membersService.findById(member);
  }

  @Patch('/:member')
  @Roles(MemberRole.ADMIN)
  @UseGuards(MembersRolesGuard)
  updateMember(@Param('member') member: string, @Body() dto: UpdateMemberDto): Promise<Member> {
    return this.membersService.updateById(member, dto);
  }

  @Delete('/:member')
  @Roles(MemberRole.ADMIN)
  @UseGuards(MembersRolesGuard)
  deleteMember(@Param('member') member: string, @GetUser() user: User): Promise<Member> {
    return this.membersService.deleteById(member, { deletedBy: user.id });
  }
}
