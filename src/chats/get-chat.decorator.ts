import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetChat = createParamDecorator((_, ctx: ExecutionContext): string => ctx.switchToHttp().getRequest().headers?.chat);