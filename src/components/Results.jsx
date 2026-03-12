import { useEffect, useState } from "react";
import { getResults } from "../services/storage";
import { useNavigate } from "react-router-dom";

function Results() {

  const [results, setResults] = useState([]);

  useEffect(() => {
    setResults(getResults());
  }, []);

  const navigate = useNavigate();

const goBack = () => {
  navigate("../");
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

      <h1>Historia wyników</h1>
      <button onClick={goBack}>
        Powrót do listy quizów
      </button>
      <button onClick={exportToCSV}>
        Export do CSV
      </button>

      {results.map(r => (
        <div key={r.id}>
          Quiz: {r.quizId} <br />
          Wynik: {r.score}/{r.total} | {r.percent}% <br />
          Data: {r.date}
        </div>
      ))}

    </div>
  );
}

export default Results;