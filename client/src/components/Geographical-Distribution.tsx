import { DataPoint } from "@/lib/type";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Chart, ArcElement, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

Chart.register({ ArcElement, Legend });
export default function GeographicalDistribution({
  data,
}: {
  data: DataPoint[];
}) {
  const adjustedData = data.map((d, i) => {
    const country = d.country ?? "";
    if (country) {
      return d;
    } else {
      const previousNonEmptyCountry = data
        .slice(0, i)
        .reverse()
        .find((item) => item.country);
      return {
        ...d,
        country: previousNonEmptyCountry ? previousNonEmptyCountry.country : "",
      };
    }
  });

  const sortedData = [...adjustedData].sort((a, b) => {
    const intensityA = a.intensity || 0;
    const intensityB = b.intensity || 0;
    return intensityB - intensityA; // Sort by intensity value in descending order
  });

  const countryMap = new Map<string, number>();
  sortedData.forEach((d) => {
    const country = d.country ?? "";
    const intensity = d.intensity || 0; // Ensure intensity has a default value
    if (countryMap.has(country)) {
      countryMap.set(country, countryMap.get(country)! + intensity);
    } else {
      countryMap.set(country, intensity);
    }
  });

  // Sort countries based on the summed intensity values
  const sortedCountries = Array.from(countryMap.keys()).sort((a, b) => {
    const intensityA = countryMap.get(a) || 0;
    const intensityB = countryMap.get(b) || 0;
    return intensityB - intensityA; // Sort by summed intensity value in descending order
  });

  const numCountries = sortedCountries.length;

  const dynamicColors = Array.from({ length: numCountries }, (_, index) => {
    const lightness = (index + 1) / (numCountries + 2); // Adjust range for more blue shades
    return `hsl(201, ${60 + index * 5}%, ${36 + lightness * 60}%)`; // Increase saturation slightly
  });

  const pieData = {
    labels: sortedCountries,
    datasets: [
      {
        label: "Users Gained",
        data: sortedCountries.map((country) => countryMap.get(country)),
        backgroundColor: dynamicColors,
        hoverBackgroundColor: dynamicColors.map((color) =>
          color.replace(/0.5/, "0.7")
        ),
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card style={{ width: "50%" }}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Geographical Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="chart-container"
          style={{ position: "relative", height: "400px", width: "100%" }}
        >
          <Doughnut data={pieData} options={{ maintainAspectRatio: false }} />
        </div>
      </CardContent>
    </Card>
  );
}
