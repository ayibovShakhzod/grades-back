import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({
    description: 'Telegram chat ID to send the message to',
    example: 123456789,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  chatId: number;

  @ApiProperty({
    description: 'Message content to send',
    example: 'Hello from the bot!',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
