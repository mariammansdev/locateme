import { Link } from "react-router";
import type { Route } from "./+types/countries";
import { useState } from "react";

import { FaGlobe, FaCoins, FaLanguage, FaPeopleGroup } from "react-icons/fa6"
export async function clientLoader() {
    const response = await fetch("https://countries.dev/countries");
    const data = await response.json();
    return data;
}
const Countries = ({loaderData} : Route.ComponentProps) => {
    const [search, setSearch] = useState<string>("");
    const [region, setRegion] = useState<string>("");
    const filteredCountries = loaderData.filter((country: any) => {
        const matchesSearch = country.name.toLowerCase().includes(search.toLowerCase());
        const matchesRegion = region ? country.region === region : true;
        return matchesSearch && matchesRegion;
    });
    console.log(loaderData)
    return (
        <div>
            <div className="mb-4 flex items-center rounded-xl bg-[#0B0E14] backdrop-blur-md bg-opacity-60 text-white shadow-lg border border-blue-950">
                <div className='grid grid-cols-2 p-8 items-center'>
                    <FaGlobe size={40} className="bg-blue-700 rounded-full "/>
                    <div>
                        <p>{filteredCountries.length}</p>
                        <p>Countries</p>
                    </div>
                 </div>
                <div className="h-12 w-px bg-amber-100/30 mx-4 self-center" />
                <div className='grid grid-cols-2 p-8 items-center'>
                    <FaPeopleGroup size={40} className="bg-blue-700 rounded-full"/>
                    <div>
                        <p>{filteredCountries.length}</p>
                        <p>Population</p>
                        
                    </div>
                </div>
                <div className="h-12 w-px bg-amber-100/30 mx-4 self-center" />
                <div className='grid grid-cols-2 p-8 items-center'>
                    <FaLanguage size={40} className="bg-blue-700 rounded-full"/>
                    <div>
                        <p>{filteredCountries.length}</p>
                        <p>Languages</p>
                        
                    </div>
                     </div>
                     <div className="h-12 w-px bg-amber-100/30 mx-4 self-center" />
                         <div className='grid grid-cols-2 p-8 items-center'>
                    <FaCoins size={40} className="bg-blue-700 rounded-full"/>
                    <div>
                        <p>{filteredCountries.length}</p>
                        <p>Currencies</p>
                        
                    </div>
                </div>
            </div>
            <div>
                <input type="text" 
                value={search}
                placeholder="Search countries..."  
                onChange={(e)=>setSearch(e.target.value)} />
                <select value={region} onChange={(e) => setRegion(e.target.value)}>
                    <option value="">All Regions</option>
                    <option value="Africa">Africa</option>
                    <option value="Americas">Americas</option>
                    <option value="Asia">Asia</option>
                    <option value="Europe">Europe</option>
                    <option value="Oceania">Oceania</option>
                </select>
            </div>
            {filteredCountries.length === 0 && <div>No countries found.</div>}
            <ul>
                {" "}
                {filteredCountries.map((country: any, key: number) => (
                    <li key={key}>
                        <Link to={`/countries/${country.name}`}>{country.name}</Link>
                        <div> Region: {country.region} | Population: {country.population} </div>
                    </li>
                ))}{" "}
            </ul>
        </div>
    )
}

export default Countries