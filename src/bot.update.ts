/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// bot.update.ts
import { Update, Start, Command, Ctx } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Update()
export class BotUpdate {
  @Start()
  async onStart(@Ctx() ctx: Context) {
    await ctx.reply('👋 Welcome! Use /help to see commands.');
  }

  @Command('help')
  async onHelp(@Ctx() ctx: Context) {
    await ctx.reply('/start - Start bot\n/help - Show commands');
  }

  @Command('hello')
  async onHello(@Ctx() ctx: Context) {
    await ctx.reply('Hello there!');
  }
}
