import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
  TableBody,
  TableHead,
} from "./ui/table";
import { ScrollArea } from "./ui/scroll-area";
import { DataPoint } from "@/lib/type";

export default function DataTable({ data }: { data: DataPoint[] }) {
  // Adjust data to ensure each row has a non-empty "Year", "Sector", or "Region" cell
  const adjustedData = data.map((d, i) => {
    const endYear = d.end_year ?? "";
    const sector = d.sector ?? "";
    const region = d.region ?? "";

    if (endYear && sector && region) {
      return d;
    } else {
      // If both current and previous rows are empty, assign a high value to move them to the end
      const previousNonEmpty = data
        .slice(0, i)
        .reverse()
        .find(
          (item) =>
            (item.end_year && item.sector && item.region) ||
            (!endYear &&
              !sector &&
              !region &&
              !item.end_year &&
              !item.sector &&
              !item.region)
        );
      return {
        ...d,
        end_year: previousNonEmpty ? previousNonEmpty.end_year : "",
        sector: previousNonEmpty ? previousNonEmpty.sector : "",
        region: previousNonEmpty ? previousNonEmpty.region : "",
      };
    }
  });

  // Sort adjusted data based on the "Year" column in ascending order
  const sortedData = [...adjustedData].sort((a, b) => {
    const yearA = a.end_year ?? "";
    const yearB = b.end_year ?? "";
    return yearA.localeCompare(yearB, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Data Table: {data.length}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-2">Year</TableHead>
                <TableHead className="px-4 py-2">Sector</TableHead>
                <TableHead className="px-4 py-2">Region</TableHead>
                <TableHead className="px-4 py-2">Intensity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((d, i) => (
                <TableRow key={i}>
                  <TableCell className="px-4 py-2">{d.end_year}</TableCell>
                  <TableCell className="px-4 py-2">{d.sector}</TableCell>
                  <TableCell className="px-4 py-2">{d.region}</TableCell>
                  <TableCell className="px-4 py-2">{d.intensity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
