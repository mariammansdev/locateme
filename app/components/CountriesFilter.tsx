
type Props = {
  search: string;
  handleSearch: (value: string) => void;
  region: string;
  handleRegion: (value: string) => void;
};
const CountriesFilter = ({search, handleSearch, region, handleRegion}: Props) => {
   return <div className="mb-4 flex flex-col gap-4 rounded-xl bg-[#0B0E14] backdrop-blur-md bg-opacity-60 text-white shadow-lg border border-blue-950 p-4 md:flex-row md:items-center md:justify-between">
        <input
            type="text"
            value={search}
            placeholder="Search countries..."
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 md:w-[60%] md:max-w-xl" />
        <select
            value={region}
            onChange={(e) => handleRegion(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 md:w-72"
        >
            <option value="">All Regions</option>
            <option value="Africa">Africa</option>
            <option value="Americas">Americas</option>
            <option value="Asia">Asia</option>
            <option value="Europe">Europe</option>
            <option value="Oceania">Oceania</option>
        </select>
    </div>;
}

export default CountriesFilter