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
import { fetchHospitals } from "src/common/utils/seedhospitals";
import { fetchPolice } from "src/common/utils/seedPolice";
import { fetchFireStations } from "src/common/utils/seedFireStation";
import { fetchTransportStation } from "src/common/utils/seedtransportStations";
import { fetchAttraction } from "src/common/utils/seedattraction";


const city = [
    { city_id: "BAL", country: "Sri Lanka", province: "Sabaragamuwa", district: "Kegalle", city: "Balangoda" },
    { city_id: "KEG", country: "Sri Lanka", province: "Sabaragamuwa", district: "Kegalle", city: "Kegalle" },
    { city_id: "EMB", country: "Sri Lanka", province: "Sabaragamuwa", district: "Ratnapura", city: "Embilipitiya" },
    { city_id: "MIN", country: "Sri Lanka", province: "Western", district: "Gampaha", city: "Minuwangoda" },
    { city_id: "JAE", country: "Sri Lanka", province: "Western", district: "Gampaha", city: "Ja-Ela" },
    { city_id: "KADW", country: "Sri Lanka", province: "Western", district: "Colombo", city: "Kaduwela" },
    { city_id: "BER", country: "Sri Lanka", province: "Western", district: "Kalutara", city: "Beruwala" },
    { city_id: "ALU", country: "Sri Lanka", province: "Western", district: "Kalutara", city: "Aluthgama" },
    { city_id: "HOR", country: "Sri Lanka", province: "Western", district: "Kalutara", city: "Horana" },
    { city_id: "BIB", country: "Sri Lanka", province: "Uva", district: "Monaragala", city: "Bibile" },
    { city_id: "KAT", country: "Sri Lanka", province: "Central", district: "Kandy", city: "Katugastota" },
    { city_id: "NAW", country: "Sri Lanka", province: "Central", district: "Kandy", city: "Nawalapitiya" },
    { city_id: "RIK", country: "Sri Lanka", province: "Sabaragamuwa", district: "Ratnapura", city: "Rakwana" },
    { city_id: "HKK", country: "Sri Lanka", province: "Southern", district: "Galle", city: "Hikkaduwa" },
    { city_id: "UDA", country: "Sri Lanka", province: "Uva", district: "Badulla", city: "Udawalawe" },
    { city_id: "SEV", country: "Sri Lanka", province: "North Central", district: "Polonnaruwa", city: "Sevanagala" },
    { city_id: "DEH", country: "Sri Lanka", province: "Western", district: "Colombo", city: "Dehiwala" },
    { city_id: "MTL", country: "Sri Lanka", province: "Western", district: "Colombo", city: "Mount Lavinia" },
    { city_id: "KOT", country: "Sri Lanka", province: "Western", district: "Colombo", city: "Kotte" },
    { city_id: "RAG", country: "Sri Lanka", province: "Western", district: "Gampaha", city: "Ragama" },
    { city_id: "GAN", country: "Sri Lanka", province: "Western", district: "Gampaha", city: "Ganemulla" },
    { city_id: "DIV", country: "Sri Lanka", province: "Western", district: "Gampaha", city: "Divulapitiya" },
    { city_id: "KEL", country: "Sri Lanka", province: "Western", district: "Gampaha", city: "Kelaniya" },

];

type CitySeedResult = {
    city_id: string;
    status: "created" | "exists";
};

@Injectable()
export class ServerDataService {

    constructor(
        @InjectModel(ServerData.name)
        private readonly serverDataModel: Model<ServerDataDocument>
    ) { }

    async seedCities() {
        const results: CitySeedResult[] = [];

        for (const c of city) {
            const exists = await this.serverDataModel.findOne({ city_id: c.city_id });

            if (exists) {
                results.push({ city_id: c.city_id, status: "exists" });
                continue;
            }

            const bounding = await getCityBounds(c.city.trim());

            await this.serverDataModel.create({
                city_id: c.city_id,
                country: c.country,
                province: c.province,
                district: c.district,
                city: c.city,
                bounding
            });

            results.push({ city_id: c.city_id, status: "created" });
        }

        return {
            success: true,
            results
        };
    }

    async seedHospitals() {
        const cities = await this.serverDataModel.find();

        const results: any[] = [];

        for (const city of cities) {
            if (!city.bounding) continue;

            const hospitals = await fetchHospitals(
                city.bounding.south,
                city.bounding.west,
                city.bounding.north,
                city.bounding.east
            );

            for (const h of hospitals) {
                const exists = city.hospital.find(
                    (x) => x.osmId === h.id
                );

                if (exists) {
                    results.push({
                        city_id: city.city_id,
                        osmId: h.id,
                        status: "exists"
                    });
                    continue;
                }

                city.hospital.push({
                    osmId: h.id,
                    osmType: h.type,
                    name: h.name,
                    latitude: h.lat,
                    longitude: h.lon,
                    tags: h.tags,
                    address: h.tags?.["addr:full"],
                    city: city.city,
                    postcode: h.tags?.["addr:postcode"],
                    phone: h.tags?.["phone"],
                    website: h.tags?.["website"],
                    healthcare: h.tags?.["healthcare"],
                    speciality: h.tags?.["healthcare:speciality"],
                    wheelchair: h.tags?.["wheelchair"],
                    bbox: city.bounding
                });

                results.push({
                    city_id: city.city_id,
                    osmId: h.id,
                    status: "created"
                });
            }


            await city.save();
        }

        return {
            success: true,
            results
        };
    }

    async seedPoliceStation() {
        const cities = await this.serverDataModel.find();

        const results: any[] = [];

        for (const city of cities) {
            if (!city.bounding) continue;

            const policeStations = await fetchPolice(
                city.bounding.south,
                city.bounding.west,
                city.bounding.north,
                city.bounding.east
            );

            for (const p of policeStations) {
                const exists = city.police.find(
                    (x) => x.osmId === p.id
                );

                if (exists) {
                    results.push({
                        city_id: city.city_id,
                        osmId: p.id,
                        status: "exists"
                    });
                    continue;
                }

                city.police.push({
                    osmId: p.id,
                    osmType: p.type,
                    name: p.tags?.name,
                    address: p.tags?.["addr:full"],
                    city: city.city,
                    operator: p.tags?.operator,
                    latitude: p.lat,
                    longitude: p.lon,
                    tags: p.tags
                });

                results.push({
                    city_id: city.city_id,
                    osmId: p.id,
                    status: "created"
                });
            }

            await city.save();
        }

        return {
            success: true,
            results
        };
    }

    async seedFireStations() {
        const cities = await this.serverDataModel.find();

        const results: any[] = [];

        for (const city of cities) {
            if (!city.bounding) continue;

            const fireStations = await fetchFireStations(
                city.bounding.south,
                city.bounding.west,
                city.bounding.north,
                city.bounding.east
            );

            for (const f of fireStations) {
                const exists = city.fireStations.find(
                    (x) => x.osmId === f.id
                );

                if (exists) {
                    results.push({
                        city_id: city.city_id,
                        osmId: f.id,
                        status: "exists"
                    });
                    continue;
                }

                city.fireStations.push({
                    osmId: f.id,
                    osmType: f.type,
                    name: f.tags?.name,
                    designation: f.tags?.designation,
                    address: f.tags?.["addr:full"],
                    city: city.city,
                    operator: f.tags?.operator,
                    latitude: f.lat,
                    longitude: f.lon,
                    tags: f.tags
                });

                results.push({
                    city_id: city.city_id,
                    osmId: f.id,
                    status: "created"
                });
            }

            await city.save();
        }

        return {
            success: true,
            results
        };
    }

    async seedTransportStations() {
        const cities = await this.serverDataModel.find();

        const results: any[] = [];

        for (const city of cities) {
            if (!city.bounding) continue;

            const transportStations = await fetchTransportStation(
                city.bounding.south,
                city.bounding.west,
                city.bounding.north,
                city.bounding.east
            );

            for (const t of transportStations) {
                const exists = city.transportStations.find(
                    (x) => x.osmId === t.id
                );

                if (exists) {
                    results.push({
                        city_id: city.city_id,
                        osmId: t.id,
                        status: "exists"
                    });
                    continue;
                }

                city.transportStations.push({
                    osmId: t.id,
                    osmType: t.type,
                    name: t.name,
                    address: t.tags?.["addr:full"],
                    city: city.city,
                    operator: t.tags?.operator,
                    publicTransport: t.tags?.["public_transport"],
                    railway: t.tags?.["railway"],
                    bus: t.tags?.["amenity"],
                    train: t.tags?.["railway"],
                    internetAccess: t.tags?.["internet_access"],
                    latitude: t.lat,
                    longitude: t.lon,
                    tags: t.tags
                });

                results.push({
                    city_id: city.city_id,
                    osmId: t.id,
                    status: "created"
                });
            }

            await city.save();
        }

        return {
            success: true,
            results
        };
    }

    async seedAtraction() {
        const cities = await this.serverDataModel.find();

        const results: any[] = [];

        for (const city of cities) {
            if (!city.bounding) continue;

            const attractions = await fetchAttraction(
                city.bounding.south,
                city.bounding.west,
                city.bounding.north,
                city.bounding.east
            );

            for (const a of attractions) {
                const exists = city.touristAttractions.find(
                    (x) => x.osmId === a.id
                );

                if (exists) {
                    results.push({
                        city_id: city.city_id,
                        osmId: a.id,
                        status: "exists"
                    });
                    continue;
                }

                city.touristAttractions.push({
                    osmId: a.id,
                    osmType: a.type,
                    name: a.name,
                    address: a.tags?.["addr:full"],
                    city: city.city,
                    tourism: a.tags?.tourism,
                    historic: a.tags?.historic,
                    religion: a.tags?.religion,
                    denomination: a.tags?.denomination,
                    memorial: a.tags?.memorial,
                    material: a.tags?.material,
                    openingHours: a.tags?.["opening_hours"],
                    architect: a.tags?.architect,
                    operator: a.tags?.operator,
                    wikipedia: a.tags?.wikipedia,
                    wikidata: a.tags?.wikidata,
                    latitude: a.lat,
                    longitude: a.lon,
                    tags: a.tags
                });

                results.push({
                    city_id: city.city_id,
                    osmId: a.id,
                    status: "created"
                });
            }

            await city.save();
        }

        return {
            success: true,
            results
        };
    }
}