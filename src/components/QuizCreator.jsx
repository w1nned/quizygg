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

      <h1 className="text-2xl font-bold mb-4">Kreator quizu</h1>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Nazwa quizu"
        onChange={(e) => setTitle(e.target.value)}/>

      <input
        className="border p-2 w-full mb-4"
        placeholder="Opis"
        onChange={(e) => setDescription(e.target.value)}/>

      <h2 className="font-semibold mb-2">Dodaj pytanie</h2>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Treść pytania"
        value={text}
        onChange={(e) => setText(e.target.value)}/>

      <select
        className="border p-2 mb-3"
        value={type}
        onChange={(e) => setType(e.target.value)}>
        <option value="single">Jednokrotny wybór</option>
        <option value="boolean">Prawda / Fałsz</option>
      </select>

      {type === "single" && options.map((opt, i) => (
        <div key={i} className="flex gap-2 mb-2">

          <input
            className="border p-2 w-full"
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
        <div className="mb-3">

          <label className="mr-4">
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

      <button onClick={addQuestion} className="bg-blue-500 text-blue-300 px-4 py-2 rounded hover:scale-110 hover:font-bold hover:text-white">Dodaj pytanie</button>

      <p className="mt-3">Liczba pytań: {questions.length}</p>

      <button onClick={saveQuiz} className="bg-green-600 text-green-300 px-4 py-2 rounded mt-4 hover:scale-110 hover:font-bold hover:text-white">Zapisz quiz</button>
    </div>
  );
}

export default QuizCreator;