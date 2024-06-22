import { IsDateString, IsNotEmpty, IsNumber, IsString, MaxLength, Min } from "class-validator";

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  description: string;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;
}
