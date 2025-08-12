import { Injectable } from '@nestjs/common';
import { Start, Update, Ctx, Command } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Update()
@Injectable()
export class BotService {
  @Start()
  async startCommand(@Ctx() ctx: Context) {
    await ctx.reply(
      `Grades - приложение для аналитики зарплат в IT и Digital. Здесь можно проанализировать сотни зарплат по грейду, годам опыта и конкретным компания. Мы охватываем десятки профессий: Разработка, Аналитика, Продукт, Дизайн, ML и тд.
      \n\nЧтобы начать пользоваться приложением нажмите кнопку “Посмотреть зарплаты”`,
      {
        message_thread_id: ctx.message?.message_thread_id,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Посмотреть зарплаты',
                url: 'https://grades.example.com',
              },
            ],
            [
              {
                text: 'Рассказать историю собеса',
                url: 'https://airtable.com/appleqXnj2fKOKFZo/pagvfgj2fdU0sqTrD/form',
              },
            ],
            [
              {
                text: 'Заглянуть в Курилку🚬',
                url: 'https://t.me/+f5KFBuuilJ9kMGE6',
              },
            ],
          ],
        },
      },
    );
  }

  async sendMessage(chatId: number, message: string) {
    try {
      console.log(`Sending message to ${chatId}: ${message}`);
      return { success: true, message: 'Message sent successfully' };
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, error: error.message };
    }
  }
}
