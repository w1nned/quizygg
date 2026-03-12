import { useEffect, useState } from "react";
import { getResults } from "../services/storage";

function Results() {

  const [results, setResults] = useState([]);

  useEffect(() => {
    setResults(getResults());
  }, []);

  return (
    <div>

      <h1 className="text-3xl font-bold mb-4 flex justify-center">Historia wyników</h1>

      {results.map(r => (
        <div
          key={r.id} className="border p-3 rounded mb-2">

          Quiz: {r.quizId} <br />
          Wynik: {r.score}/{r.total} | {r.percent}% <br />
          Data: {r.date}
        </div>
      ))}
    </div>
  );
}

export default Results;