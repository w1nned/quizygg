import { useParams, useNavigate } from "react-router-dom";
import { getQuizzes, getResults, saveResults } from "../services/storage";
import { useState, useEffect } from "react";

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
  const [timeLeft, setTimeLeft] = useState(20);
  const [startTime] = useState(Date.now());

  const q = questions[currentQuestion];


  const colors = ["#FF4C4C", "#4C6EFF", "#4CFF88", "#9D4CFF"];

  useEffect(() => {
  if (finished) return;

  if (timeLeft === 0) {
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setTimeLeft(20);
    } else {
      finishQuiz(answers);
    }
    return;
  }

  const timer = setTimeout(() => {
    setTimeLeft(prev => prev - 1);
  }, 1000);

  return () => clearTimeout(timer);
}, [timeLeft, currentQuestion, finished]);



  const selectAnswer = (index) => {
  const newAnswers = { ...answers, [q.id]: index };
  setAnswers(newAnswers);

  setTimeout(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(20); 
    } else {
      finishQuiz(newAnswers);
    }
  }, 300);
};



  const finishQuiz = (finalAnswers) => {
  let score = 0;

  questions.forEach(q => {
    if (finalAnswers[q.id] === q.correct) score++;
  });

  const percent = Math.round((score / questions.length) * 100);

  const endTime = Date.now();
  const totalTimeSec = Math.floor((endTime - startTime) / 1000);

  const minutes = Math.floor(totalTimeSec / 60);
  const seconds = totalTimeSec % 60;

  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  const results = getResults();
  results.push({
    id: Date.now(),
    quizId: quiz.title,
    date: new Date().toLocaleString(),
    score,
    total: questions.length,
    percent,
    time: formattedTime 
  });

  saveResults(results);

  setResult({ score, percent, time: formattedTime });
  setFinished(true);
};

  if (finished) {
    return (
      <div style={styles.container}>
        <h1 className="text-2xl font-bold mb-4" style={styles.title}>Wynik quizu</h1>
        <p style={styles.text}>Wynik: {result.score}/{questions.length}</p>
        <p style={styles.text}>Procent: {result.percent}%</p>
        <p style={styles.text}>Czas: {result.time}</p>
        <button className="mt-5 bg-sky-500 cursor-pointer text-white px-4 py-2 rounded font-bold hover:scale-110 transform duration-100" style={styles.button} onClick={() => navigate("/")}>
          Powrót do listy quizów
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 className="text-lg font-semi-bold" style={styles.quizTitle}>{quiz.title}</h3>
      <h1 className="text-2xl font-bold mb-4" style={styles.question}>{q.question}</h1>

      <div style={styles.options}>
        {q.options.slice(0, 4).map((opt, i) => {
          const isSelected = answers[q.id] === i;
          return (
            <div
              className="text-4xl font-bold hover:scale-105 transform duration-100 active:opacity-25"
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
      <div style={styles.timerWrapper}>
  <div
    style={{
      ...styles.timerBar,
      width: `${(timeLeft / 20) * 100}%`
    }}
  />
</div>
<p>{timeLeft}s</p>
    </div>
  );
}

const styles = {
  timerWrapper: {
  width: "100%",
  height: "10px",
  backgroundColor: "#ddd",
  borderRadius: "5px",
  overflow: "hidden",
  marginTop: "20px"
},
timerBar: {
  height: "100%",
  backgroundColor: "#22c55e",
  transition: "width 1s linear"
},
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
    position: "absolute",
    left: "175px",
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