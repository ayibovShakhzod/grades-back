/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// bot.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Context, Telegraf } from 'telegraf';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { SendMessageDto } from './dto/send-message.dto';

@ApiTags('Telegram Bot')
@Controller('bot')
export class BotController {
  constructor(
    @Inject('TELEGRAF_BOT') private readonly bot: Telegraf<Context>,
  ) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send message via Telegram bot',
    description: 'Sends a message to a specific Telegram chat using the bot',
  })
  @ApiBody({
    type: SendMessageDto,
    description: 'Message data including chat ID and message content',
  })
  @ApiResponse({
    status: 200,
    description: 'Message sent successfully',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'sent',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 400,
        },
        message: {
          type: 'array',
          items: {
            type: 'string',
          },
          example: ['chatId must be a number', 'message should not be empty'],
        },
        error: {
          type: 'string',
          example: 'Bad Request',
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Bot error or Telegram API error',
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
          example: 500,
        },
        message: {
          type: 'string',
          example: 'Internal server error',
        },
      },
    },
  })
  async sendMessage(@Body() body: SendMessageDto) {
    try {
      const { chatId, message } = body;
      await this.bot?.telegram?.sendMessage(chatId, message);
      return { status: 'sent' };
    } catch (error) {
      console.log('🚀 ~ BotController ~ sendMessage ~ error:', error);
      throw error;
    }
  }

  @Post('send-to-many')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send message to multiple Telegram chats',
    description: 'Sends a message to multiple Telegram chat IDs using the bot',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        chatIds: {
          type: 'array',
          items: { type: 'number' },
          description: 'Array of Telegram chat IDs',
          example: [123456789, 987654321],
        },
        message: {
          type: 'string',
          description: 'Message content',
          example: 'Hello, everyone!',
        },
      },
      required: ['chatIds', 'message'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Messages sent successfully',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'sent' },
        sent: { type: 'number', example: 2 },
        failed: { type: 'number', example: 0 },
        errors: {
          type: 'array',
          items: { type: 'object' },
          example: [],
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @ApiInternalServerErrorResponse({
    description: 'Bot error or Telegram API error',
  })
  async sendMessageToMany(
    @Body() body: { chatIds: number[]; message: string },
  ) {
    const { chatIds, message } = body;
    const errors: { chatId: number; error: any }[] = [];
    let sent = 0;
    const startTime = Date.now();
    for (const chatId of chatIds) {
      try {
        await this.bot?.telegram?.sendMessage(chatId, message);
        sent++;
      } catch (error) {
        errors.push({ chatId, error: error?.message || error });
      }
    }
    const endTime = Date.now();
    const durationMs = endTime - startTime;
    return {
      status: 'sent',
      sent,
      failed: errors.length,
      errors,
      timeMs: durationMs,
    };
  }
}
