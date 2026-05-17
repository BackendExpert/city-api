import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config'
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ServerDataModule } from './dataserver/serverdata.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    ServerDataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
