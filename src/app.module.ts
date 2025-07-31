import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotModule } from './bot/bot.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TelegrafModule.forRoot({
      token:
        process.env.TELEGRAM_BOT_TOKEN ||
        '8039968923:AAFe5OPWf6DAkBZ8_5svEK2mT71EJB5ft0c',
    }),
    BotModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
