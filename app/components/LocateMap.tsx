import { useEffect, useState } from "react";
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
  zoom?: number;
};

const LocateMap = ({ countries, zoom }: LocateMapProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const validCountries = countries.filter((country) => {
    const latlng = country.latlng ?? country.capitalInfo?.latlng;
    return (
      Array.isArray(latlng) &&
      latlng.length === 2 &&
      Number.isFinite(latlng[0]) &&
      Number.isFinite(latlng[1])
    );
  });

  const firstCountry = validCountries[0];
  const defaultCenter: [number, number] = [20, 0];
  const center: [number, number] = firstCountry?.latlng
    ? [firstCountry.latlng[0], firstCountry.latlng[1]]
    : firstCountry?.capitalInfo?.latlng
      ? [firstCountry.capitalInfo.latlng[0], firstCountry.capitalInfo.latlng[1]]
      : defaultCenter;

  if (!isClient) {
    return (
      <div className="h-[25rem] w-full rounded-lg border border-slate-700 bg-slate-900/40" />
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom || 2}
      scrollWheelZoom={false}
      className="h-[25rem] w-full rounded-lg"
      style={{ height: "25rem", width: "100%" }}
    >
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