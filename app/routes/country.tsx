import CountryClock from "~/components/CountryClock";
import type { Route } from "./+types/country";

export async function clientLoader({ params }: Route.LoaderArgs) {
  const response = await fetch(
    `https://countries.dev/countries/name/${params.countryName}`,
  );
  const data = await response.json();
  return data;
}
const country = ({ loaderData }: Route.ComponentProps) => {
  const countryData = loaderData[0];
  const country = {
    name: countryData.name,
    officialName: countryData.name,
    region: countryData.region,
    subregion: countryData.subregion,
    capital: countryData.capital,
    population: countryData.population,
    area: countryData.area,
    languages: countryData.languages,
    currencies: countryData.currencies,
    flag: countryData.flag,
  };
debugger
  return (
    <div className= " grid items-center justify-center">
    <CountryClock country={country.capital} timezone={`${country.region}/${country.capital}`} />
      {/* {Object.keys(country).map((key) => (
        <div key={key}>
          <strong>{key}:</strong> {country[key as keyof typeof country]}
        </div>
      ))} */}
    </div>
  );
};

export default country;
