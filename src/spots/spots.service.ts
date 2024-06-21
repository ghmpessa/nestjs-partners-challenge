import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSpotDto } from './dto/create-spot.dto';
import { UpdateSpotDto } from './dto/update-spot.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SpotStatus } from '@prisma/client';

@Injectable()
export class SpotsService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createSpotDto: CreateSpotDto & { eventId: string }) {
    return await this.prismaService.spot.create({
      data: {
        ...createSpotDto,
        status: SpotStatus.available,
        eventId: createSpotDto.eventId,
      }
    });
  }

  async findAll(eventId: string) {
    return await this.prismaService.spot.findMany({
      where: {
        eventId
      }
    });
  }

  async findOne(eventId: string, id: string) {
    return await this.prismaService.spot.findUnique({
      where: {
        id,
        eventId,
      }
    });
  }

  async update(eventId: string, id: string, updateSpotDto: UpdateSpotDto) {
    const spot = await this.findOne(eventId, id);

    if (!spot) throw new HttpException(`Spot with ID ${id} not found`, HttpStatus.NOT_FOUND,);

    return await this.prismaService.spot.update({
      where: {
        id,
        eventId
      },
      data: {
        id,
        eventId,
        ...spot,
        ...updateSpotDto,
      }
    });
  }

  remove(eventId: string, id: string) {
    return `This action removes a #${id} spot`;
  }
}
