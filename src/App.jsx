import { BrowserRouter, Routes, Route } from "react-router-dom";
import QuizList from "./components/QuizList";
import QuizCreator from "./components/QuizCreator";
import QuizPlayer from "./components/QuizPlayer";
import Results from "./components/Results";
import bg from "./assets/bgs1.webp";

function App() {
  return (
    <BrowserRouter>
    <div className="h-239 w-full bg-center bg-cover bg-[url(assets/bgs1.webp)]">
      <div className="p-6 max-w-3xl mx-auto">

        <Routes>
          <Route path="/" element={<QuizList />} />
          <Route path="/create" element={<QuizCreator />} />
          <Route path="/quiz/:id" element={<QuizPlayer />} />
          <Route path="/results" element={<Results />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;