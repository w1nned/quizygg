import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getQuizzes, saveQuizzes } from "../services/storage";


function QuizList() {

  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    setQuizzes(getQuizzes());
  }, []);

  const deleteQuiz = (id) => {

    const updated = quizzes.filter(q => q.id !== id);
    setQuizzes(updated);
    saveQuizzes(updated);

  };

  return (
    <div>
      <h1>Quizy</h1>

      <div className="mb-6 flex gap-3">
        <Link to="/create">
          Nowy quiz
        </Link>

        <Link to="/results">
          Wyniki
        </Link>
      </div>

      {quizzes.map(q => (
        <div
          key={q.id}>

          <h3>{q.title}</h3>

          <p>{q.description}</p>

          <div>

            <Link
              to={`/quiz/${q.id}`}>
              Rozwiąż
            </Link>

            <button
              onClick={() => deleteQuiz(q.id)}>
              Usuń
            </button>

          </div>

        </div>
      ))}

    </div>
  );
}

export default QuizList;