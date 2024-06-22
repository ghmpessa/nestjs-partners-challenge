import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ReserveSpotDto } from './dto/reserve-spot.dto';
import { Prisma, SpotStatus, TicketStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

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

  async remove(id: string) {
    const event = await this.findOne(id);

    if (!event) throw new HttpException(`ID ${id} not found`, HttpStatus.NOT_FOUND);

    return this.prismaService.event.delete({
      where: {
        id
      }
    });
  }

  async reserveSpot(reserveSpotDto: ReserveSpotDto & { eventId: string }) {
    const spots = await this.prismaService.spot.findMany({
      where: {
        eventId: reserveSpotDto.eventId,
        name: {
          in: reserveSpotDto.spots
        }
      }
    });

    if (spots.length !== reserveSpotDto.spots.length) {
      const foundSpotsName = spots.map((spot) => spot.name);
      const notFoundSpotsNames = reserveSpotDto.spots.filter((spotName) => !foundSpotsName.includes(spotName));

      throw new HttpException(`Spots not exists: ${notFoundSpotsNames.join(', ')}`, HttpStatus.NOT_FOUND);
    }

    const reservedSpots = await this.prismaService.spot.findMany({
      where: {
        id: {
          in: spots.map((spot) => spot.id)
        },
        status: TicketStatus.reserved
      }
    })

    if (reservedSpots.length > 0) {
      throw new HttpException(`Spots ${reservedSpots.map(spot => spot.name).join(', ')} is not available for reservation`, HttpStatus.BAD_REQUEST);
    }

    try {
      const tickets = await this.prismaService.$transaction(async (prisma) => {
        await prisma.reservationHistory.createMany({
          data: spots.map((spot) => ({
            spotId: spot.id,
            ticketKind: reserveSpotDto.ticket_kind,
            email: reserveSpotDto.email,
            status: TicketStatus.reserved,
          }))
        });

        await prisma.spot.updateMany({
          where: {
            id: {
              in: spots.map(spot => spot.id),
            }
          },
          data: {
            status: SpotStatus.reserved,
          }
        });

        const tickets = await Promise.all(spots.map((spot) =>
          prisma.ticket.create({
            data: {
              spotId: spot.id,
              ticketKind: reserveSpotDto.ticket_kind,
              email: reserveSpotDto.email,
            }
          })
        ));

        return tickets;
      }, {
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      })

      return tickets;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002':
          case 'P2034':
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }

        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

    }
  }
}
