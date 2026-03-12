import { BrowserRouter, Routes, Route } from "react-router-dom";
import QuizList from "./components/QuizList";
import QuizCreator from "./components/QuizCreator";
import QuizPlayer from "./components/QuizPlayer";
import Results from "./components/Results";

function App() {
  return (
    <BrowserRouter>
      <div className="p-6 mx-auto">

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