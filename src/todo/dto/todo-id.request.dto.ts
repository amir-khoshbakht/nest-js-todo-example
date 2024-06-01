import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class TodoIdDto {
  @ApiProperty({
    example: '665847c6b8928a862377f267',
    description: 'ID of the todo.',
  })
  @IsMongoId()
  todoId: string;
}
