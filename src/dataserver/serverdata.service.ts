import {
    ConflictException,
    Injectable
} from "@nestjs/common";

import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import {
    ServerData,
    ServerDataDocument
} from "./schema/server.schema";

import getCityBounds from "../common/utils/bbox.util";


import { InitialDto } from "./dto/initial.dto";


@Injectable()
export class ServerDataService {

    constructor(
        @InjectModel(ServerData.name)
        private readonly serverDataModel: Model<ServerDataDocument>
    ) { }

    async getBoundaryBox(dto: InitialDto) {
        const checkcity = await this.serverDataModel.findOne({ city_id: dto.city_id })

        if (checkcity) {
            throw new ConflictException("City Already in API")
        }

        const citybbox = await getCityBounds(dto.city.trim());

        const createcity = await this.serverDataModel.create({
            city_id: dto.city_id,
            country: dto.country,
            province: dto.province,
            district: dto.district,
            city: dto.city,
            bounding: citybbox
        })

        return {
            success: true,
            message: "City Added"
        }
    }
}