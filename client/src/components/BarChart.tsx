import { Bar } from "react-chartjs-2";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { DataPoint } from "@/lib/type";
import { Chart, LinearScale, BarElement, CategoryScale } from "chart.js";

Chart.register({ LinearScale, BarElement, CategoryScale });

export default function BarChart({
  end_years,
  data,
  setData,
  dataForFilter,
}: {
  end_years: string[];
  data: DataPoint[];
  setData: (data: DataPoint[]) => void;
  dataForFilter: DataPoint[];
}) {
  const [selectedYear, setSelectedYear] = useState<string>("");

  // Adjust labels to use previous label if current one is empty
  let lastNonEmptyLabel = "";
  const labels = data.map((d) => {
    if (d.end_year) {
      lastNonEmptyLabel = d.end_year;
    }
    return lastNonEmptyLabel;
  });

  // Sort labels array to ensure they are in ascending order
  labels.sort((a, b) => {
    const yearA = a ?? "";
    const yearB = b ?? "";
    return yearA.localeCompare(yearB, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });

  // Generate dynamic colors for bars based on the number of unique labels
  const dynamicColors = labels.map((label, index) => {
    const hue = (index * (360 / labels.length)) % 360; // Distribute colors evenly across the color wheel
    return `hsl(${hue}, 70%, 50%)`; // Use HSL colors for better distinction
  });

  const barData = {
    labels: labels,
    datasets: [
      {
        label: "Users Gained",
        data: data.map((data) => data.intensity),
        backgroundColor: dynamicColors,
        borderColor: dynamicColors,
        borderWidth: 2,
      },
    ],
  };

  const dataChangeByEndYear = (end_year: string) => {
    const filteredData = dataForFilter.filter((d) => d.end_year === end_year);
    setData(filteredData);
    setSelectedYear(end_year);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Tracking: {selectedYear}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <label
            className="text-sm font-medium text-gray-500"
            htmlFor="end-year"
          >
            End Year:
          </label>
          <Select onValueChange={dataChangeByEndYear}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {end_years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Bar className="w-full" data={barData} />
        </div>
      </CardContent>
    </Card>
  );
}
