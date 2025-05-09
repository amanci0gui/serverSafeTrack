import { Controller, Get, Query } from '@nestjs/common';
import { PlacesService } from './places.service';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('places')
export class PlacesController {
    constructor(private readonly placesService: PlacesService) {}
    // Define your endpoints here

    @Roles("USER")
    @Roles("ADMIN")
    @Get()
    findPlace(@Query("text") text: string) {
        return this.placesService.findPlace(text);
    }
}
