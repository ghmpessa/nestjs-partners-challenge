import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createEventDto: CreateEventDto) {
    return await this.prismaService.event.create({
      data: {
        ...createEventDto,
        date: new Date(createEventDto.date),
      }
    });
  }

  async findAll() {
    return await this.prismaService.event.findMany();
  }

  async findOne(id: string) {
    return await this.prismaService.event.findUnique({
      where: { id }
    });
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const currentEvent = await this.findOne(id);

    if (!currentEvent) throw new HttpException(`ID ${id} not found`, HttpStatus.NOT_FOUND);

    return this.prismaService.event.update({
      where: { id },
      data: {
        ...currentEvent,
        ...updateEventDto,
      }
    });
  }

  remove(id: string) {
    return `This action removes a #${id} event`;
  }
}
