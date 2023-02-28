import { IsString, IsArray, ArrayMinSize, ArrayMaxSize } from 'class-validator';

export class CreateFriendDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  users: string[];
}