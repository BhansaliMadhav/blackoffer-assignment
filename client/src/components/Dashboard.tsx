import { DataPoint } from "@/lib/type";
import BarChart from "./BarChart";
import KeyMetrics from "./KeyMetrics";
import DataTable from "./DataTable";
import GeographicalDistribution from "./Geographical-Distribution";

export default function Dashboard({
  data,
  dataForFilter,
  setData,
}: {
  data: DataPoint[];
  dataForFilter: DataPoint[];
  setData: (data: DataPoint[]) => void;
}) {
  const topics = Array.from(
    new Set(
      dataForFilter
        .map((d) => d.topic)
        .filter((d) => d !== "")
        .sort()
    )
  );
  const end_years = Array.from(
    new Set(
      dataForFilter
        .map((d) => d.end_year)
        .filter((d) => d !== "")
        .sort()
    )
  );
  const sectors = Array.from(
    new Set(
      dataForFilter
        .map((d) => d.sector)
        .filter((d) => d !== "")
        .sort()
    )
  );
  const regions = Array.from(
    new Set(
      dataForFilter
        .map((d) => d.region)
        .filter((d) => d !== "")
        .sort()
    )
  );
  const pests = Array.from(
    new Set(
      dataForFilter
        .map((d) => d.pestle)
        .filter((d) => d !== "")
        .sort()
    )
  );
  const sources = Array.from(
    new Set(
      dataForFilter
        .map((d) => d.source)
        .filter((d) => d !== "")
        .sort()
    )
  );
  const swots = Array.from(
    new Set(
      dataForFilter
        .map((d) => d.likelihood)
        .filter((d) => d !== null)
        .sort()
    )
  );
  const counties = Array.from(
    new Set(
      dataForFilter
        .map((d) => d.country)
        .filter((d) => d !== "")
        .sort()
    )
  );
  const cities = Array.from(
    new Set(
      dataForFilter
        .map((d) => d.region)
        .filter((d) => d !== "")
        .sort()
    )
  );
  const swotsName = ["Strengths", "Weaknesses", "Opportunities", "Threats"];

  return (
    <div className="mx-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 py-4">
        <KeyMetrics
          {...{
            topics,
            sectors,
            regions,
            counties,
            cities,
            pests,
            sources,
            swots,
            swotsName,
            data,
            dataForFilter,
          }}
          setData={setData}
        />
        <BarChart
          end_years={end_years}
          data={data}
          setData={setData}
          dataForFilter={dataForFilter}
        />
        <DataTable data={data} />
        <GeographicalDistribution data={data} />
      </div>
    </div>
  );
}
