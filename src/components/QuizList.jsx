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
          <Link to="/create" className="bg-blue-500 text-blue-300 px-4 py-2 rounded font-bold hover:scale-110 hover:text-white transform duration-100">
            Nowy quiz
          </Link>

          <Link to="/results" className="bg-gray-600 text-gray-300 px-4 py-2 rounded hover:font-bold hover:scale-110 hover:text-white tranform duration-100">
            Wyniki
          </Link>
        </div>

        {quizzes.map(q => (
          <div
            key={q.id} className="border p-4 rounded-xl border-2 mb-3 shadow hover:border-sky-500 hover:scale-105 tranform duration-300">

            <h3 className="text-xl font-semibold">{q.title}</h3>

            <p className="text-gray-600">{q.description}</p>

            <div className="mt-3 flex gap-3">

              <Link
                to={`/quiz/${q.id}`} className="bg-green-500 text-green-200 px-3 py-1 rounded font-bold hover:scale-110 hover:text-white tranform duration-100">
                Rozwiąż
              </Link>

              <button
                onClick={() => deleteQuiz(q.id)} className="bg-red-500 cursor-pointer text-red-900 px-3 py-1 rounded font-bold hover:scale-110 hover:text-gray-900 tranform duration-100">
                Usuń
              </button>

            </div>

          </div>
        ))}

      </div>
  );
}

export default QuizList;