import { DataPoint } from "@/lib/type";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Chart, LinearScale, BarElement, CategoryScale } from "chart.js";
import { Bar } from "react-chartjs-2";

Chart.register({ LinearScale, BarElement, CategoryScale });

export default function GeographicalDistribution({
  data,
}: {
  data: DataPoint[];
}) {
  // Adjust data to ensure each data point has a non-empty "Country" cell
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

  // Sort adjusted data based on the "Country" column in ascending order
  const sortedData = [...adjustedData].sort((a, b) => {
    const countryA = a.country ?? "";
    const countryB = b.country ?? "";
    return countryA.localeCompare(countryB, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });

  // Aggregate data based on countries
  const countryMap = new Map<string, number>();
  sortedData.forEach((d) => {
    const country = d.country ?? "";
    const intensity = d.intensity;
    if (countryMap.has(country)) {
      countryMap.set(country, countryMap.get(country)! + intensity);
    } else {
      countryMap.set(country, intensity);
    }
  });

  // Sort countries in ascending order
  const sortedCountries = Array.from(countryMap.keys()).sort();

  // Generate dynamic colors for bars based on the number of unique countries
  const dynamicColors = Array.from(
    { length: sortedCountries.length },
    (_, index) => {
      const hue = (index * (360 / sortedCountries.length)) % 360; // Distribute colors evenly across the color wheel
      return `hsl(${hue}, 70%, 50%)`; // Use HSL colors for better distinction
    }
  );

  const barData = {
    labels: sortedCountries,
    datasets: [
      {
        label: "Users Gained",
        data: sortedCountries.map((country) => countryMap.get(country)),
        backgroundColor: dynamicColors,
        borderColor: dynamicColors,
        borderWidth: 2,
      },
    ],
  };

  return (
    <Card>
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
          <Bar
            data={barData}
            options={{
              maintainAspectRatio: false,
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                },
                y: {
                  beginAtZero: true,
                  grid: {
                    color: "rgba(0, 0, 0, 0.1)",
                  },
                  ticks: {
                    callback: function (value: number | string) {
                      if (typeof value === "number") {
                        return value.toLocaleString(); // Format y-axis labels as numbers with commas
                      }
                      return value;
                    },
                  },
                },
              },
              plugins: {
                legend: {
                  display: true,
                  position: "bottom",
                  labels: {
                    font: {
                      size: 14,
                    },
                  },
                },
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
