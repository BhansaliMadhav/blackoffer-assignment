import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import { DataPoint } from "./lib/type";
import axios from "axios";
import { Button } from "./components/ui/button";

export default function App() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [dataForFilter, setDataForFilter] = useState<DataPoint[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const url = "http://localhost:5000/data";

  useEffect(() => {
    axios
      .get<DataPoint[]>(url)
      .then((response) => {
        const data = response.data;
        setData(data);
        setDataForFilter(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-screen-2xl mx-auto py-[5vmin] min-h-screen">
      <h1 className="text-5xl font-medium text-center mb-10">
        Data Visualization Dashboard
      </h1>
      {loading && (
        <p className="flex justify-center items-center py-[15vmin]">
          Loading...
        </p>
      )}
      {error && <p>Error</p>}

      {!loading && !error && (
        <Dashboard
          data={data}
          setData={setData}
          dataForFilter={dataForFilter}
        />
      )}
      <Button className=" bg-[#0077b6]" onClick={() => setData(dataForFilter)}>
        Reset
      </Button>
    </div>
  );
}
