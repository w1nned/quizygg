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
    <div className="mx-auto w-fit flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4 flex justify-center">Quizy</h1>

      <div className="mb-6 flex gap-3">
        <Link to="/create" className="bg-blue-500 text-white px-4 py-2 rounded">
          Nowy quiz
        </Link>

        <Link to="/results" className="bg-gray-600 text-gray-300 px-4 py-2 rounded">
          Wyniki
        </Link>
      </div>

      {quizzes.map(q => (
        <div
          key={q.id} className="border p-4 rounded mb-3 shadow">

          <h3 className="text-xl font-semibold">{q.title}</h3>

          <p className="text-gray-600">{q.description}</p>

          <div className="mt-3 flex gap-3">

            <Link
              to={`/quiz/${q.id}`} className="bg-green-500 text-white px-3 py-1 rounded">
              Rozwiąż
            </Link>

            <button
              onClick={() => deleteQuiz(q.id)} className="bg-red-500 text-white px-3 py-1 rounded">
              Usuń
            </button>

          </div>

        </div>
      ))}

    </div>
  );
}

export default QuizList;