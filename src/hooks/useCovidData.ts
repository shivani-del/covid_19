import { useQuery } from "@tanstack/react-query";

export interface CovidCountry {
  country: string;
  countryInfo: { flag: string; iso2: string };
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  active: number;
  critical: number;
  casesPerOneMillion: number;
  deathsPerOneMillion: number;
  tests: number;
  population: number;
  continent: string;
}

export const useCovidData = () =>
  useQuery<CovidCountry[]>({
    queryKey: ["covid-countries"],
    queryFn: async () => {
      const res = await fetch("https://disease.sh/v3/covid-19/countries");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });
