import { useParams } from "react-router-dom";
import { useState } from "react";
import { getQuizzes, getResults, saveResults } from "../services/storage";
import { useNavigate} from "react-router-dom";

function QuizPlayer() {

  const { id } = useParams();

  const quiz = getQuizzes().find(q => q.id == id);

  const [answers, setAnswers] = useState({});

  const navigate = useNavigate();

  const submitQuiz = () => {

    let score = 0;

    quiz.questions.forEach(q => {

      if (answers[q.id] === q.correct) {
        score++;
      }

    });

    const percent = Math.round((score / quiz.questions.length) * 100);

    const results = getResults();

    results.push({
      id: Date.now(),
      quizId: quiz.title,
      date: new Date().toLocaleString(),
      score,
      total: quiz.questions.length,
      percent
    });

    saveResults(results);

    alert(`Twój wynik: ${score}/${quiz.questions.length} (${percent}%) `);
    navigate("/");
  };

  return (
    <div>

      <h1>{quiz.title}</h1>

      {quiz.questions.map((q, index) => (
        <div key={q.id}>

          <p>{index + 1}. {q.question}</p>

          {q.options.map((opt, i) => (
            <label key={i}>
              <input
                type="radio"
                name={q.id}
                onChange={() =>
                  setAnswers({ ...answers, [q.id]: i })
                }/>
                
              {opt}

            </label>
          ))}

        </div>
      ))}

      <button onClick={submitQuiz}>Zakończ quiz</button>

    </div>
  );
}

export default QuizPlayer;