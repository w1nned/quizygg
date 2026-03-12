import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getQuizzes, getResults, saveResults } from "../services/storage";

function QuizPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const quiz = getQuizzes().find(q => q.id == id);

  const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

  const [questions] = useState(shuffle(quiz.questions));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState(null);

  const q = questions[currentQuestion];


  const colors = ["#FF4C4C", "#4C6EFF", "#4CFF88", "#9D4CFF"];

  const selectAnswer = (index) => {
    setAnswers(prev => ({ ...prev, [q.id]: index }));

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        finishQuiz();
      }
    }, 300);
  };

  const finishQuiz = () => {
    let score = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct) score++;
    });
    const percent = Math.round((score / questions.length) * 100);

    const results = getResults();
    results.push({
      id: Date.now(),
      quizId: quiz.title,
      date: new Date().toLocaleString(),
      score,
      total: questions.length,
      percent
    });
    saveResults(results);

    setResult({ score, percent });
    setFinished(true);
  };

  if (finished) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Wynik quizu</h1>
        <p style={styles.text}>Wynik: {result.score}/{questions.length}</p>
        <p style={styles.text}>Procent: {result.percent}%</p>
        <button style={styles.button} onClick={() => navigate("/")}>
          Powrót do listy quizów
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.quizTitle}>{quiz.title}</h3>
      <h1 style={styles.question}>{q.question}</h1>

      <div style={styles.options}>
        {q.options.slice(0, 4).map((opt, i) => {
          const isSelected = answers[q.id] === i;
          return (
            <div
              key={i}
              onClick={() => selectAnswer(i)}
              style={{
                ...styles.tile,
                backgroundColor: colors[i % colors.length],
                ...(isSelected ? styles.tileSelected : {}),
              }}
            >
              {opt}
            </div>
          );
        })}
      </div>

      <p style={styles.progress}>
        Pytanie {currentQuestion + 1} / {questions.length}
      </p>
    </div>
  );
}

const styles = {
  progress:{
    textAlign:"center"
  },
  quizTitle:{
    textAlign:"center"
  },
  question:{
    textAlign: "center",
  marginBottom: "30px"
  },
  container:{
    width: "85vw",
    textAlign:"center"
  },
  options: {
    marginTop: "200px",
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)", 
    gap: "40px",
    width: "100%",
    marginBottom: "30px",
  },
  tile: {
    cursor: "pointer",
    borderRadius: "12px",
    border: "2px solid transparent",
    color: "#fff",
    fontSize: "18px",
    userSelect: "none",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "140px",        
    boxSizing: "border-box",
    textAlign: "center",
    padding: "10px",       
    aspectRatio: "3 / 2",  
  },
  tileSelected: {
    borderColor: "#fff",
    fontWeight: "700",
    filter: "brightness(0.85)",
  },
 
};

export default QuizPlayer;