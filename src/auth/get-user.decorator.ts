import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "./entities/user.entity";

export const GetUser = createParamDecorator((_, ctx: ExecutionContext): User => ctx.switchToHttp().getRequest().user);