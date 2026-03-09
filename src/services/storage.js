export const getQuizzes = () => {
  return JSON.parse(localStorage.getItem("quizzes")) || [];
};
 
export const saveQuizzes = (quizzes) => {
  localStorage.setItem("quizzes", JSON.stringify(quizzes));
};
 
export const getResults = () => {
  return JSON.parse(localStorage.getItem("results")) || [];
};
 
export const saveResults = (results) => {
  localStorage.setItem("results", JSON.stringify(results));
};