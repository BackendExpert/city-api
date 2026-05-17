import { Body, Controller, Post } from "@nestjs/common";
import { ServerDataService } from "./serverdata.service";
import { InitialDto } from "./dto/initial.dto";

@Controller("api/serverdata")
export class ServerDataController {
    constructor(
        private readonly serverdataService: ServerDataService
    ) {}

    @Post("create-bbox")
    async createBBox(
        @Body("") dto: InitialDto
    ) {
        return await this.serverdataService.getBoundaryBox(dto);
    }
}