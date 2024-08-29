import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RatesModule } from './rates/rates.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ThrottlerModule.forRoot([{ limit: 10, ttl: 6000 }]),
    RatesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
