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
import { SendMessageToManyDto } from './dto/send-message-to-many.dto';

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
      const { chatId, message, imageUrl, videoUrl } = body;

      switch (true) {
        case !!imageUrl:
          await this.bot?.telegram?.sendPhoto(chatId, imageUrl, {
            caption: message,
            parse_mode: 'HTML',
          });
          break;
        case !!videoUrl:
          await this.bot?.telegram?.sendVideo(chatId, videoUrl, {
            caption: message,
            parse_mode: 'HTML',
          });
          break;
        default:
          await this.bot?.telegram?.sendMessage(chatId, message, {
            parse_mode: 'HTML',
          });
      }
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
    type: SendMessageToManyDto,
    description: 'Message data including chat IDs and message content',
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
    @Body()
    body: SendMessageToManyDto,
  ) {
    const { chatIds, message } = body;
    const errors: { chatId: number; error: any }[] = [];
    let sent = 0;
    const startTime = Date.now();
    for (const chatId of chatIds) {
      try {
        switch (true) {
          case !!body.imageUrl:
            await this.bot?.telegram?.sendPhoto(chatId, body.imageUrl, {
              caption: message,
              parse_mode: 'HTML',
            });
            break;
          case !!body.videoUrl:
            await this.bot?.telegram?.sendVideo(chatId, body.videoUrl, {
              caption: message,
              parse_mode: 'HTML',
            });
            break;
          default:
            await this.bot?.telegram?.sendMessage(chatId, message, {
              parse_mode: 'HTML',
            });
        }
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
