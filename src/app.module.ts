import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProblemModule } from './modules/problem/problem.module';
import configuration from './config/configuration';
import { ExecutionModule } from './modules/execution/execution.module';
import { JudgeModule } from './modules/judge/judge.module';
import { SubmissionModule } from './modules/submission/submission.module';
import { RunModule } from './modules/run/run.module';
import { RunController } from './modules/run/run.controller';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    //30 requests / minute / IP
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000, // milisecond
          limit: 10,
        },
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:['.env'],
      load:[configuration]
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
    }),
    UserModule,
    AuthModule,
    ProblemModule,
    ExecutionModule,
    JudgeModule,
    SubmissionModule,
    RunModule
  ],
  controllers: [RunController],
  providers:[
     {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ]
})
export class AppModule {}
