export const getQuizzes = () => {
  return JSON.parse(localStorage.getItem("quizzes")) || [];
};

export const saveQuizzes = (quizzes) => {
  localStorage.setItem("quizzes", JSON.stringify(quizzes));
};