import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ServerData, ServerDataSchema } from "./schema/server.schema";
import { ServerDataController } from "./serverdata.controller";
import { ServerDataService } from "./serverdata.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ServerData.name, schema: ServerDataSchema}
        ])
    ],
    controllers: [ServerDataController],
    providers: [ServerDataService],
    exports: [ServerDataService]
})

export class ServerDataModule { }
