import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ServerDataDocument = ServerData & Document

@Schema({ timestamps: true })

@Schema({ _id: false })
export class BoundingBox {

    @Prop()
    south!: number;

    @Prop()
    north!: number;

    @Prop()
    west!: number;

    @Prop()
    east!: number;
}

@Schema({ _id: false })
export class Hospital {

    @Prop({ required: true })
    osmId!: number;

    @Prop({ required: true, enum: ["node", "way"] })
    osmType!: string;

    @Prop({ required: true })
    name!: string;

    @Prop()
    address?: string;

    @Prop()
    city?: string;

    @Prop()
    postcode?: string;

    @Prop()
    phone?: string;

    @Prop()
    website?: string;

    @Prop()
    healthcare?: string;

    @Prop()
    speciality?: string;

    @Prop()
    wheelchair?: string;

    @Prop({ required: true })
    latitude!: number;

    @Prop({ required: true })
    longitude!: number;

    @Prop({
        type: {
            south: Number,
            west: Number,
            north: Number,
            east: Number,
        },
        default: null
    })
    bbox?: {
        south: number;
        west: number;
        north: number;
        east: number;
    };

    @Prop({ type: Object })
    tags?: Record<string, any>;
}

@Schema({ _id: false })
export class Police {

    @Prop({ required: true })
    osmId!: number;

    @Prop({ required: true, enum: ["node", "way"] })
    osmType!: string;

    @Prop()
    name?: string;

    @Prop()
    address?: string;

    @Prop()
    city?: string;

    @Prop()
    operator?: string;

    @Prop({ required: true })
    latitude!: number;

    @Prop({ required: true })
    longitude!: number;

    @Prop({ type: Object })
    tags?: Record<string, any>;
}

@Schema({ _id: false })
export class FireStation {

    @Prop({ required: true })
    osmId!: number;

    @Prop({ required: true, enum: ["node", "way"] })
    osmType!: string;

    @Prop()
    name?: string;

    @Prop()
    designation?: string;

    @Prop()
    address?: string;

    @Prop()
    city?: string;

    @Prop()
    operator?: string;

    @Prop({ required: true })
    latitude!: number;

    @Prop({ required: true })
    longitude!: number;

    @Prop({ type: Object })
    tags?: Record<string, any>;
}

@Schema({ _id: false })
export class TransportStation {

    @Prop({ required: true })
    osmId!: number;

    @Prop({ required: true, enum: ["node", "way"] })
    osmType!: string;

    @Prop()
    name?: string;

    @Prop()
    address?: string;

    @Prop()
    city?: string;

    @Prop()
    operator?: string;

    @Prop()
    publicTransport?: string;

    @Prop()
    railway?: string;

    @Prop()
    bus?: string;

    @Prop()
    train?: string;

    @Prop()
    internetAccess?: string;

    @Prop({ required: true })
    latitude!: number;

    @Prop({ required: true })
    longitude!: number;

    @Prop({ type: Object })
    tags?: Record<string, any>;
}


@Schema({ _id: false })
export class TouristAttraction {

    @Prop({ required: true })
    osmId!: number;

    @Prop({ required: true, enum: ["node", "way"] })
    osmType!: string;

    @Prop()
    name?: string;

    @Prop()
    address?: string;

    @Prop()
    city?: string;

    @Prop()
    tourism?: string;

    @Prop()
    historic?: string;

    @Prop()
    religion?: string;

    @Prop()
    denomination?: string;

    @Prop()
    memorial?: string;

    @Prop()
    material?: string;

    @Prop()
    openingHours?: string;

    @Prop()
    architect?: string;

    @Prop()
    operator?: string;

    @Prop()
    wikipedia?: string;

    @Prop()
    wikidata?: string;

    @Prop({ required: true })
    latitude!: number;

    @Prop({ required: true })
    longitude!: number;

    @Prop({ type: Object })
    tags?: Record<string, any>;
}

@Schema({ timestamps: true })
export class ServerData {
    @Prop()
    city_id!: string;

    @Prop()
    country!: string;

    @Prop()
    province!: string;

    @Prop()
    district!: string;

    @Prop()
    city!: string;

    @Prop({ type: BoundingBox })
    bounding!: BoundingBox;

    @Prop({ type: [Hospital], default: [] })
    hospital!: Hospital[];

    @Prop({ type: [Police], default: [] })
    police!: Police[];

    @Prop({ type: [FireStation], default: [] })
    fireStations!: FireStation[];

    @Prop({ type: [TransportStation], default: [] })
    transportStations!: TransportStation[];

    @Prop({ type: [TouristAttraction], default: [] })
    touristAttractions!: TouristAttraction[];
}

export const ServerDataSchema = SchemaFactory.createForClass(ServerData);