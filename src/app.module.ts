import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RatesModule } from './rates/rates.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    RatesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
