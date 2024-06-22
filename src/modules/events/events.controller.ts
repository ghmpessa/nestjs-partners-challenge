import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  HttpCode,
  UseGuards,
  UseFilters
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ReserveSpotDto } from './dto/reserve-spot.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ReservedSpotsExceptionFilter } from 'src/common/filters/http-exception.filter';



@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) { }

  @Post()
  @UsePipes(new ValidationPipe({
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  }))
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  }))
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }

  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  }))
  @UseFilters(ReservedSpotsExceptionFilter)
  @Post(':id/reserve')
  reserveSpot(@Param('id') id: string, @Body() reserveSpotDto: ReserveSpotDto) {
    return this.eventsService.reserveSpot({
      eventId: id,
      ...reserveSpotDto,
    })
  }
}
