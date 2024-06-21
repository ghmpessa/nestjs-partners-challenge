import { Injectable } from '@nestjs/common';
import { CreateSpotDto } from './dto/create-spot.dto';
import { UpdateSpotDto } from './dto/update-spot.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SpotStatus } from '@prisma/client';

@Injectable()
export class SpotsService {
  constructor(private readonly prismaService: PrismaService) { }

  create(createSpotDto: CreateSpotDto & { eventId: string }) {
    return this.prismaService.spot.create({
      data: {
        ...createSpotDto,
        status: SpotStatus.available,
        eventId: createSpotDto.eventId,
      }
    });
  }

  findAll(eventId: string) {
    return this.prismaService.spot.findMany({
      where: {
        eventId
      }
    });
  }

  findOne(eventId: string, id: string) {
    return this.prismaService.spot.findUnique({
      where: {
        id,
        eventId,
      }
    });;
  }

  update(eventId: string, id: string, updateSpotDto: UpdateSpotDto) {
    return `This action updates a #${id} spot`;
  }

  remove(eventId: string, id: string) {
    return `This action removes a #${id} spot`;
  }
}
