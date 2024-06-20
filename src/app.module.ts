import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [EventsModule, PrismaModule],
})
export class AppModule { }
