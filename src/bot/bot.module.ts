import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotController } from '../bot.controller';
import { Telegraf, Context } from 'telegraf';

@Module({
  controllers: [BotController],
  providers: [
    BotService,
    {
      provide: 'TELEGRAF_BOT',
      useFactory: () => {
        return new Telegraf<Context>(
          process.env.TELEGRAM_BOT_TOKEN ||
            '8039968923:AAFe5OPWf6DAkBZ8_5svEK2mT71EJB5ft0c',
        );
      },
    },
  ],
  exports: [BotService, 'TELEGRAF_BOT'],
})
export class BotModule {}
