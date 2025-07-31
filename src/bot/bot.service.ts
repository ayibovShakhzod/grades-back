import { Injectable } from '@nestjs/common';
import { Start, Update, Ctx, Command } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Update()
@Injectable()
export class BotService {
  @Start()
  async startCommand(@Ctx() ctx: Context) {
    const firstName = ctx.from?.first_name || 'User';
    await ctx.reply(
      `🤖 Hello ${firstName}! Welcome to our Telegram Bot!\n\n` +
        `I'm here to help you. Here are some things you can do:\n` +
        `• Send me any message and I'll echo it back\n` +
        `• Use /help to see available commands\n` +
        `• Use /info to get bot information\n\n` +
        `Let's get started! 🚀`,
      {
        message_thread_id: ctx.message?.message_thread_id,
        reply_markup: {
          inline_keyboard: [
            [
              { text: '📋 Help', callback_data: 'help' },
              { text: 'ℹ️ Info', callback_data: 'info' },
            ],
          ],
        },
      },
    );
  }

  @Command('help')
  async helpCommand(@Ctx() ctx: Context) {
    console.log('🚀 ~ BotService ~ helpCommand ~ ctx:', ctx);
    if (!ctx.chat) return;

    ctx.telegram.sendMessage(
      ctx?.chat?.id,
      `🆘 *Help Menu*\n\n` +
        `Available commands:\n` +
        `• /start - Start the bot\n` +
        `• /help - Show this help message\n` +
        `• /info - Get bot information\n` +
        `• /ping - Test bot responsiveness\n\n` +
        `Just send me any text message and I'll echo it back to you!`,
      {
        parse_mode: 'Markdown',
      },
    );
  }

  @Command('info')
  async infoCommand(@Ctx() ctx: Context) {
    await ctx.reply(
      `🤖 *Bot Information*\n\n` +
        `• Built with NestJS + Telegraf\n` +
        `• Node.js version: ${process.version}\n` +
        `• Uptime: ${Math.floor(process.uptime())} seconds\n` +
        `• Created with ❤️ using Bolt\n\n` +
        `Ready to serve you! 🎯`,
      { parse_mode: 'Markdown' },
    );
  }

  @Command('ping')
  async pingCommand(@Ctx() ctx: Context) {
    const start = Date.now();
    const message = await ctx.reply('🏓 Pinging...');
    const end = Date.now();

    await ctx.telegram.editMessageText(
      ctx.chat?.id,
      message.message_id,
      undefined,
      `🏓 Pong! Response time: ${end - start}ms`,
    );
  }

  // Handle all text messages (echo functionality)
  @Command(/.*/)
  async handleMessage(@Ctx() ctx: Context) {
    if (ctx.message && 'text' in ctx.message) {
      const text = ctx.message.text;

      // Skip if it's a command
      if (text.startsWith('/')) {
        return;
      }

      await ctx.reply(`📝 You said: "${text}"\n\n` + `✨ Echo: ${text}`, {
        message_thread_id: ctx.message.message_id,
      });
    }
  }

  // Handle callback queries from inline keyboards
  @Command('callback_query')
  async handleCallbackQuery(@Ctx() ctx: Context) {
    if ('callback_query' in ctx.update) {
      const callbackQuery = ctx.update.callback_query;
      const data = ctx.text;

      await ctx.answerCbQuery();

      switch (data) {
        case 'help':
          await this.helpCommand(ctx);
          break;
        case 'info':
          await this.infoCommand(ctx);
          break;
        default:
          await ctx.reply('Unknown callback data');
      }
    }
  }

  // Method to send messages programmatically
  async sendMessage(chatId: number, message: string) {
    try {
      // Note: In a real application, you'd inject the Telegraf bot instance
      // For now, this is a placeholder for the concept
      console.log(`Sending message to ${chatId}: ${message}`);
      return { success: true, message: 'Message sent successfully' };
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, error: error.message };
    }
  }
}
