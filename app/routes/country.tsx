import type { Route } from "./+types/country";

export async function clientLoader({ params }: Route.LoaderArgs) {
  console.log(params.countryName);
  const response = await fetch(
    `https://countries.dev/countries/name/${params.countryName}`,
  );
  const data = await response.json();
  return data;
}
const country = ({ loaderData }: Route.ComponentProps) => {
  const country = {
    name: loaderData.name,
    officialName: loaderData.name,
    region: loaderData.region,
    subregion: loaderData.subregion,
    capital: loaderData.capital,
    population: loaderData.population,
    area: loaderData.area,
    languages: loaderData.languages,
    currencies: loaderData.currencies,
    flag: loaderData.flag,
  };

  return (
    <>
      {Object.keys(country).map((key) => (
        <div key={key}>
          <strong>{key}:</strong> {country[key as keyof typeof country]}
        </div>
      ))}
    </>
  );
};

export default country;
