import { BrowserRouter, Routes, Route } from "react-router-dom";
import QuizList from "./components/QuizList";
import QuizCreator from "./components/QuizCreator";
import QuizPlayer from "./components/QuizPlayer";
import Results from "./components/Results";

function App() {
  return (
    <BrowserRouter basename="{process.env.w1nned.github.io/quizygg}">
    <div className="h-239 w-full bg-center bg-cover bg-[url(assets/bgs1.webp)]">
      <div className="p-6 max-w-3xl mx-auto">

        <Routes>
          <Route path="/" element={<QuizList />} />
          <Route path="/create" element={<QuizCreator />} />
          <Route path="/quiz/:id" element={<QuizPlayer />} />
          <Route path="/results" element={<Results />} />
        </Routes>

      </div>
    </div>
    </BrowserRouter>
  );
}

export default App;