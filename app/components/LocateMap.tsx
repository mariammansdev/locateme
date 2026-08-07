import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type CountryMarker = {
  name: string;
  capital?: string;
  latlng?: [number, number];
  capitalInfo?: {
    latlng?: [number, number];
  };
};

type LocateMapProps = {
  countries: CountryMarker[];
};

const LocateMap = ({ countries }: LocateMapProps) => {
  const validCountries = countries.filter((country) => {
    const latlng = country.latlng ?? country.capitalInfo?.latlng;
    return Array.isArray(latlng) && latlng.length === 2 && Number.isFinite(latlng[0]) && Number.isFinite(latlng[1]);
  });

  const firstCountry = validCountries[0];
  const defaultCenter: [number, number] = [20, 0];
  const center: [number, number] = firstCountry?.latlng
    ? [firstCountry.latlng[0], firstCountry.latlng[1]]
    : firstCountry?.capitalInfo?.latlng
      ? [firstCountry.capitalInfo.latlng[0], firstCountry.capitalInfo.latlng[1]]
      : defaultCenter;

  return (
    <MapContainer center={center} zoom={2} scrollWheelZoom={false} className="mb-4 h-[500px] w-full rounded-lg">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {validCountries.map((country) => {
        const latlng = country.latlng ?? country.capitalInfo?.latlng;

        if (!latlng) return null;

        return (
          <Marker key={country.name} position={[latlng[0], latlng[1]]}>
            <Popup>
              <strong>{country.name}</strong>
              <br />
              {country.capital || "No capital"}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default LocateMap;