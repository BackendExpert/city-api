import axios from "axios";

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

export async function fetchFireStations(
    south: number,
    west: number,
    north: number,
    east: number
) {
    const query = `
[out:json][timeout:25];

(
  node["amenity"="fire_station"](${south},${west},${north},${east});
  way["amenity"="fire_station"](${south},${west},${north},${east});
  relation["amenity"="fire_station"](${south},${west},${north},${east});
);

out center;
`;

    const response = await axios.post(
        OVERPASS_URL,
        query,
        {
            headers: {
                "Content-Type": "text/plain",
                "User-Agent": "sl-smart-city-api"
            }
        }
    );

    return response.data.elements.map((el: any) => ({
        id: el.id,
        type: el.type,
        name: el.tags?.name || "Unknown fire_station",
        lat: el.lat || el.center?.lat,
        lon: el.lon || el.center?.lon,
        tags: el.tags
    }));
}