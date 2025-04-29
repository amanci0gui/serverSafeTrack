import { Controller, Get, Query } from '@nestjs/common';
import { PlacesService } from './places.service';

@Controller('places')
export class PlacesController {
    constructor(private readonly placesService: PlacesService) {}
    // Define your endpoints here

    @Get()
    findPlace(@Query("text") text: string) {
        return this.placesService.findPlace(text);
    }
}
