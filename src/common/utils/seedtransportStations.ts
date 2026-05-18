import axios from "axios";

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

export async function fetchTransportStation(
    south: number,
    west: number,
    north: number,
    east: number
) {
    const query = `
[out:json][timeout:25];

(
  /* 🚌 Bus Stations */
  node["amenity"="bus_station"](${south},${west},${north},${east});
  way["amenity"="bus_station"](${south},${west},${north},${east});
  relation["amenity"="bus_station"](${south},${west},${north},${east});

  /* 🚆 Railway Stations */
  node["railway"="station"](${south},${west},${north},${east});
  way["railway"="station"](${south},${west},${north},${east});
  relation["railway"="station"](${south},${west},${north},${east});

  /* ✈️ Airports */
  node["aeroway"="aerodrome"](${south},${west},${north},${east});
  way["aeroway"="aerodrome"](${south},${west},${north},${east});
  relation["aeroway"="aerodrome"](${south},${west},${north},${east});

  /* 🚢 Harbors / Ports */
  node["harbour"](${south},${west},${north},${east});
  way["harbour"](${south},${west},${north},${east});
  relation["harbour"](${south},${west},${north},${east});

  node["man_made"="pier"](${south},${west},${north},${east});
  way["man_made"="pier"](${south},${west},${north},${east});
  relation["man_made"="pier"](${south},${west},${north},${east});
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
        name:
            el.tags?.name ||
            el.tags?.operator ||
            el.tags?.["aeroway"] ||
            el.tags?.["railway"] ||
            "Unknown Transport",
        lat: el.lat || el.center?.lat,
        lon: el.lon || el.center?.lon,
        tags: el.tags
    }));
}