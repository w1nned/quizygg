import { useEffect, useState } from "react";
import { getResults, saveResults } from "../services/storage";
import { useNavigate } from "react-router-dom";

function Results() {

  const [results, setResults] = useState([]);

  useEffect(() => {
    const data = getResults();
    setResults([...data].reverse());
  }, []);
  
  const navigate = useNavigate();

  const goBack = () => {
    navigate("../");
  };

  const deleteResult = (id) => {
    const updated = results.filter(r => r.id !== id);
    setResults(updated);
    saveResults(updated.reverse());
  };

  const exportToCSV = () => {

    const headers = ["Quiz ID", "Score", "Total", "Percent", "Date"];

    const rows = results.map(r => [
      r.quizId,
      r.score,
      r.total,
      r.percent,
      r.date
    ]);

    const csv = [
      headers.join(";"),
      ...rows.map(row =>
        row.map(value => `"${value}"`).join(";")
      )
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "quiz_results.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>

      <h1 className="text-3xl font-bold mb-4 flex justify-center">Historia wyników</h1>

      <div className="mx-auto w-fit items-center mb-6 flex gap-3">
        <button
          className="bg-sky-500 text-sky-300 px-4 py-2 rounded font-bold hover:scale-110 hover:text-white transform duration-100"
          onClick={goBack}>
          Powrót do listy quizów
        </button>

        <button
          className="bg-green-600 text-green-300 px-4 py-2 rounded hover:font-bold hover:scale-110 hover:text-white transform duration-100"
          onClick={exportToCSV}>
          Export do CSV
        </button>
      </div>

      {results.map(r => (
        <div
          key={r.id}
          className="border p-3 rounded-xl border-2 mb-2 flex justify-between items-center hover:border-sky-500 hover:scale-105 transform duration-200">
          <div>
            Quiz: {r.quizId} <br />
            Wynik: {r.score}/{r.total} | {r.percent}% <br />
            Data: {r.date}
          </div>

          <button
            onClick={() => deleteResult(r.id)}
            className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 hover:scale-110 transform duration-100">
            ✕
          </button>

        </div>
      ))}

    </div>
  );
}

export default Results;