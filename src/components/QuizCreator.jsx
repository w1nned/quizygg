import { useState, useEffect } from "react";
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

  const [history, setHistory] = useState([]);
  const [step, setStep] = useState(-1);

  const [currentIndex, setCurrentIndex] = useState(null);

  const addQuestion = () => {
    if (!text) return;

    const q = {
      id: Date.now(),
      type,
      question: text,
      options: type === "single" ? options : ["Prawda", "Fałsz"],
      correct
    };

    const newQuestions = [...questions, q];
    setQuestions(newQuestions);

    setText("");
    setOptions(["", "", "", ""]);

    const newState = {
      text: "",
      options: ["", "", "", ""],
      correct,
      type,
      questions: newQuestions
    };

    const updatedHistory = history.slice(0, step + 1);
    updatedHistory.push(newState);

    setHistory(updatedHistory);
    setStep(updatedHistory.length - 1);
  };

  const saveQuestion = () => {
    if (!text) return;

    const q = {
      id: currentIndex !== null ? questions[currentIndex].id : Date.now(),
      type,
      question: text,
      options: type === "single" ? options : ["Prawda", "Fałsz"],
      correct
    };

    let updated;

    if (currentIndex !== null) {

      updated = [...questions];
      updated[currentIndex] = q;
    } else {

      updated = [...questions, q];
      setCurrentIndex(updated.length - 1);
    }

    setQuestions(updated);
  };

  const goBack = () => {
    navigate("../");
  };

  const saveAndAddNew = () => {
    saveQuestion();

    setText("");
    setOptions(["", "", "", ""]);
    setCorrect(0);
    setType("single");

    setCurrentIndex(null);
  };

  const addNewQuestion = () => {
    setText("");
    setOptions(["", "", "", ""]);
    setCorrect(0);
    setType("single");

    setCurrentIndex(null);
  };

  const prevQuestion = () => {
    console.log(currentIndex);
    console.log(text);

    if (questions.length === 0) return;


    if (currentIndex === null) {
      const lastIndex = questions.length - 1;
      const prev = questions[lastIndex];
      if (!prev) return;

      setText(prev.question);
      setOptions(prev.options);
      setCorrect(prev.correct);
      setType(prev.type);
      setCurrentIndex(lastIndex);
      return;
    }


    if (currentIndex <= 0) return;

    const newIndex = currentIndex - 1;
    const prev = questions[newIndex];
    if (!prev) return;

    setText(prev.question);
    setOptions(prev.options);
    setCorrect(prev.correct);
    setType(prev.type);
    setCurrentIndex(newIndex);
  };

  const nextQuestion = () => {
    if (currentIndex === null || currentIndex >= questions.length - 1) return;

    const next = questions[currentIndex + 1];

    setText(next.question);
    setOptions(next.options);
    setCorrect(next.correct);
    setType(next.type);

    setCurrentIndex(currentIndex + 1);
  };

  const saveQuiz = () => {
  saveQuestion();

  if (questions.length === 0 && !text) {
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

  const saveStateToHistory = () => {
    const newState = {
      text,
      options,
      correct,
      type,
      questions
    };

    const updatedHistory = history.slice(0, step + 1);
    updatedHistory.push(newState);

    setHistory(updatedHistory);
    setStep(updatedHistory.length - 1);
  };

  const undo = () => {
    if (step <= 0) return;

    const prev = history[step - 1];

    setText(prev.text);
    setOptions(prev.options);
    setCorrect(prev.correct);
    setType(prev.type);
    setQuestions(prev.questions);

    setStep(step - 1);
  };

  useEffect(() => {
    saveStateToHistory();
  }, []);

  return (
    <div>
      <div className="mx-auto w-fit items-center mb-6 mt-6 flex gap-47">
        <h1 className="mx-auto flex text-2xl font-bold mb-4">Kreator quizu</h1>
        <button
          className="justify-center cursor-pointer bg-sky-500 text-sky-300 px-4 py-2 rounded font-bold hover:scale-110 hover:text-white transform duration-100"
          onClick={goBack}>
          Powrót do listy quizów
        </button>
      </div>

      <input
        className="border p-2 rounded-lg w-full mb-2 hover:border-green-500 hover:border-2"
        placeholder="Nazwa quizu"
        onChange={(e) => setTitle(e.target.value)} />

      <input
        className="border p-2 rounded-lg w-full mb-4 hover:border-green-500 hover:border-2"
        placeholder="Opis"
        onChange={(e) => setDescription(e.target.value)} />

      <h2 className="font-semibold mb-2">Dodaj pytanie</h2>

      <input
        className="border p-2 rounded-lg w-full mb-2 hover:border-green-500 hover:border-2"
        placeholder="Treść pytania"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          saveStateToHistory();
        }} />

      <select
        className="border rounded-sm p-2 mb-3 hover:border-green-500 hover:border-2"
        value={type}
        onChange={(e) => {
          setType(e.target.value);
          saveStateToHistory();
        }}>
        <option value="single">Jednokrotny wybór</option>
        <option value="boolean">Prawda / Fałsz</option>
      </select>

      {type === "single" && options.map((opt, i) => (
        <div key={i} className="flex gap-2 mb-2">

          <input
            className="border rounded-lg p-2 w-full hover:border-green-500 hover:border-2"
            placeholder={`Odpowiedź ${i + 1}`}
            value={opt}
            onChange={(e) => {
              const copy = [...options];
              copy[i] = e.target.value;
              setOptions(copy);
              saveStateToHistory();
            }} />

          <input
            className="relative top-3 form-radio custom-radio text-green-600 tranform duration-300"
            type="radio"
            name="correct"
            checked={correct === i}
            onChange={() => {
              setCorrect(i);
              saveStateToHistory();
            }} />

        </div>
      ))}

      {type === "boolean" && (
        <div className="mb-3">

          <label className="mr-4">
            <input
              className="relative top-0.5 form-radio custom-radio text-green-600"
              type="radio"
              checked={correct === 0}
              onChange={() => setCorrect(0)} /> Prawda</label>

          <label>
            <input
              className="relative top-0.5 form-radio custom-radio text-green-600"
              type="radio"
              checked={correct === 1}
              onChange={() => setCorrect(1)} /> Fałsz</label>
        </div>
      )}

      {/*<button onClick={addQuestion} className="bg-blue-500 cursor-pointer text-blue-300 px-5 py-2 rounded hover:scale-110 hover:font-bold hover:text-white transform duration-100">Dodaj pytanie</button>*/}
      <div className="flex gap-2 mt-4 flex-wrap justify-between">

        <button onClick={prevQuestion} className="bg-gray-500 ml-3 mr-3 cursor-pointer text-gray-300 px-4 py-2 rounded hover:scale-110 hover:font-bold hover:text-white transform duration-100">
          ⬅
        </button>

        <button onClick={saveQuestion} className="bg-purple-500 mr-3 cursor-pointer text-purple-300 px-5 py-2 rounded hover:scale-110 hover:font-bold hover:text-white transform duration-100">
          💾 Zapisz pytanie
        </button>

        {/*<button onClick={saveAndAddNew} className="bg-green-500 mr-3 cursor-pointer text-green-300 px-5 py-2 rounded hover:scale-110 hover:font-bold hover:text-white transform duration-100">
          ✅ Zapisz i dodaj
        </button>*/}

        <button onClick={saveAndAddNew} className="bg-blue-500 mr-3 cursor-pointer text-blue-300 px-5 py-2 rounded hover:scale-110 hover:font-bold hover:text-white transform duration-100">
          ➕ Nowe pytanie
        </button>

        <button onClick={nextQuestion} className="bg-gray-500 mr-2 cursor-pointer text-gray-300 px-5 py-2 rounded hover:scale-110 hover:font-bold hover:text-white transform duration-100">
          ➡
        </button>

      </div>

      <p className="mt-3">Liczba pytań: {questions.length}</p>
      <p className="mt-1">
        Aktualne pytanie: {currentIndex !== null ? currentIndex + 1 : (questions.length + 1)} / {questions.length}{currentIndex !== null ? "" : " (szkic)"}
      </p>

      <button onClick={saveQuiz} className="bg-green-600 text-green-300 cursor-pointer px-4 py-2 rounded mt-4 hover:scale-110 hover:font-bold hover:text-white tranform duration-100">Zapisz quiz</button>
    </div>
  );
}

export default QuizCreator;