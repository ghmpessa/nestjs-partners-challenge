import { TicketKind } from "@prisma/client";
import { ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsString } from "class-validator";

export class ReserveSpotDto {
  @IsNotEmpty()
  @IsArray()
  @IsString({
    each: true,
  })
  @ArrayMinSize(1)
  spots: string[];

  @IsNotEmpty()
  @IsEnum(TicketKind)
  ticket_kind: TicketKind;
  email: string;
}