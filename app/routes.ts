import { type RouteConfig, index, route, prefix} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"), 

    ...prefix("countries",[
        route(":countryName","routes/country.tsx"), 
        index("routes/countries.tsx")
    ]),
    route("About","routes/About.tsx")
] satisfies RouteConfig;
