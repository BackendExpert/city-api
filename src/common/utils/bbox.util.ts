import axios from "axios";

export default async function getCityBounds(city: string) {
    const url = `https://nominatim.openstreetmap.org/search?q=${city},Sri Lanka&format=jsonv2`;

    const response = await axios.get(url, {
        headers: {
            "User-Agent": "sl-smart-city-api"
        }
    });

    if (!response.data || response.data.length === 0) {
        throw new Error(`City not found: ${city}`);
    }

    const data = response.data[0];

    if (!data.boundingbox) {
        throw new Error("Bounding box not available");
    }

    const bbox = data.boundingbox;

    return {
        south: parseFloat(bbox[0]),
        north: parseFloat(bbox[1]),
        west: parseFloat(bbox[2]),
        east: parseFloat(bbox[3]),
    };
}