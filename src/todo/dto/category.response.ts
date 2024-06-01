import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../schemas/category.schema';

export class CategoryResponseDto {
  static response({ _id, user, title }: Category) {
    const response = {
      id: _id.toHexString(),
      userId: user.toHexString(),
      title,
    } as CategoryResponseDto;
    return response;
  }

  @ApiProperty({
    description: 'ID of the category.',
    example: '665847c6b8928a862377f267',
  })
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  title: string;
}
