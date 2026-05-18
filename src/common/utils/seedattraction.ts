import axios from "axios";

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

export async function fetchAttraction(
    south: number,
    west: number,
    north: number,
    east: number
) {
    const query = `
[out:json][timeout:25];

(
  /* 🎡 Tourism places */
  node["tourism"](${south},${west},${north},${east});
  way["tourism"](${south},${west},${north},${east});
  relation["tourism"](${south},${west},${north},${east});

  /* 🏛 Historic places */
  node["historic"](${south},${west},${north},${east});
  way["historic"](${south},${west},${north},${east});
  relation["historic"](${south},${west},${north},${east});

  /* 🕌 Religious places */
  node["amenity"="place_of_worship"](${south},${west},${north},${east});
  way["amenity"="place_of_worship"](${south},${west},${north},${east});
  relation["amenity"="place_of_worship"](${south},${west},${north},${east});

  /* 🐘 Zoos */
  node["tourism"="zoo"](${south},${west},${north},${east});
  way["tourism"="zoo"](${south},${west},${north},${east});
  relation["tourism"="zoo"](${south},${west},${north},${east});

  /* 🗽 Memorials */
  node["historic"="memorial"](${south},${west},${north},${east});
  way["historic"="memorial"](${south},${west},${north},${east});
  relation["historic"="memorial"](${south},${west},${north},${east});

  /* 🌿 Natural attractions */
  node["natural"](${south},${west},${north},${east});
  way["natural"](${south},${west},${north},${east});
  relation["natural"](${south},${west},${north},${east});
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
            el.tags?.tourism ||
            el.tags?.historic ||
            "Unknown Attraction",
        lat: el.lat || el.center?.lat,
        lon: el.lon || el.center?.lon,
        tags: el.tags
    }));
}