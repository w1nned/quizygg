import { useEffect, useState } from "react";
import { getResults } from "../services/storage";

function Results() {

  const [result, setResults] = useState([]);

  useEffect(() => {
    setResults(getResults());
  }, []);

  return (
    <div>

      <h1>Historia wyników</h1>

      {result.map(r => (
        <div
          key={r.id}>

          Quiz: {r.quizId} <br />
          Wynik: {r.score}/{r.total} ({r.percent}%) <br />
          Data: {r.date}

        </div>
      ))}
    </div>
  );
}

export default Results;