import { Body, Controller, Post } from "@nestjs/common";
import { ServerDataService } from "./serverdata.service";
import { InitialDto } from "./dto/initial.dto";

@Controller("api/serverdata")
export class ServerDataController {
    constructor(
        private readonly serverdataService: ServerDataService
    ) { }

    @Post("create-bbox")
    async createBBox(
    ) {
        return await this.serverdataService.seedCities();
    }

    @Post("seed-hospitals")
    async seedHospitals(

    ) {
        return await this.serverdataService.seedHospitals();
    }

    @Post("seed-police")
    async seedPolice(

    ) {
        return await this.serverdataService.seedPoliceStation();
    }

    @Post("seed-firestations")
    async seedfirestations(

    ) {
        return await this.serverdataService.seedFireStations();
    }

    @Post("seed-transport")
    async seedTransport(

    ) {
        return await this.serverdataService.seedTransportStations();
    }

    @Post("seed-atraction")
    async seedAtraction(

    ) {
        return await this.serverdataService.seedAtraction();
    }
}