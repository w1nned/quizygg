import { useState } from "react";
import { getQuizzes, saveQuizzes } from "../services/storage";
import { useNavigate } from "react-router-dom";

function QuizCreator() {

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [questions, setQuestions] = useState([]);

  const [type, setType] = useState("single");

  const [text, setText] = useState("");

  const [options, setOptions] = useState(["", "", "", ""]);

  const [correct, setCorrect] = useState(0);

  const addQuestion = () => {

    if (!text) return;

    const q = {
      id: Date.now(),
      type,
      question: text,
      options: type === "single" ? options : ["Prawda", "Fałsz"],
      correct
    };

    setQuestions([...questions, q]);

    setText("");
    setOptions(["", "", "", ""]);

  };

  const saveQuiz = () => {

    if (questions.length === 0) {
      alert("Dodaj przynajmniej jedno pytanie");
      return;
    }

    const quizzes = getQuizzes();

    quizzes.push({
      id: Date.now(),
      title,
      description,
      questions
    });

    saveQuizzes(quizzes);
    navigate("/");
  };

  return (
    <div>

      <h1>Kreator quizu</h1>

      <input
        placeholder="Nazwa quizu"
        onChange={(e) => setTitle(e.target.value)}/>

      <input
        placeholder="Opis"
        onChange={(e) => setDescription(e.target.value)}/>

      <h2>Dodaj pytanie</h2>

      <input
        placeholder="Treść pytania"
        value={text}
        onChange={(e) => setText(e.target.value)}/>

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}>
        <option value="single">Jednokrotny wybór</option>
        <option value="boolean">Prawda / Fałsz</option>
      </select>

      {type === "single" && options.map((opt, i) => (
        <div key={i}>

          <input
            placeholder={`Odpowiedź ${i + 1}`}
            value={opt}
            onChange={(e) => {
              const copy = [...options];
              copy[i] = e.target.value;
              setOptions(copy);
            }}/>

          <input
            type="radio"
            name="correct"
            checked={correct === i}
            onChange={() => setCorrect(i)}/>

        </div>
      ))}

      {type === "boolean" && (
        <div>

          <label>
            <input
              type="radio"
              checked={correct === 0}
              onChange={() => setCorrect(0)}/>Prawda</label>

          <label>
            <input
              type="radio"
              checked={correct === 1}
              onChange={() => setCorrect(1)}/>Fałsz</label>
        </div>
      )}

      <button onClick={addQuestion}>Dodaj pytanie</button>

      <p>Liczba pytań: {questions.length}</p>

      <button onClick={saveQuiz}>Zapisz quiz</button>
    </div>
  );
}

export default QuizCreator;