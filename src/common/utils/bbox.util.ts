import axios from "axios";

const delay = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms));

export default async function getCityBounds(city: string) {

    await delay(2000);

    const url =
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)},Sri Lanka&format=jsonv2&limit=1`;

    const response = await axios.get(url, {
        headers: {
            "User-Agent": "sl-smart-city-api/1.0"
        }
    });

    if (!response.data || response.data.length === 0) {
        throw new Error(`City not found: ${city}`);
    }

    const data = response.data[0];

    if (!data.boundingbox) {
        throw new Error(`Bounding box not available for ${city}`);
    }

    const bbox = data.boundingbox;

    return {
        south: parseFloat(bbox[0]),
        north: parseFloat(bbox[1]),
        west: parseFloat(bbox[2]),
        east: parseFloat(bbox[3]),
    };
}