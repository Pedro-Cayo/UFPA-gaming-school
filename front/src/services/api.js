import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

// Auth
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile')
};

// Disciplines
export const disciplineService = {
  create: (data) => api.post('/disciplines', data),
  getMyDisciplines: () => api.get('/disciplines/professor/my-disciplines'),
  getAll: () => api.get('/disciplines/all'),
  getById: (id) => api.get(`/disciplines/${id}`),
  update: (id, data) => api.put(`/disciplines/${id}`, data),
  delete: (id) => api.delete(`/disciplines/${id}`)
};

// Questionnaires
export const questionnaireService = {
  create: (data) => api.post('/questionnaires', data),
  getByDiscipline: (disciplineId) => api.get(`/questionnaires/discipline/${disciplineId}`),
  getById: (id) => api.get(`/questionnaires/${id}`),
  getForAnswering: (id) => api.get(`/questionnaires/answer/${id}`),
  update: (id, data) => api.put(`/questionnaires/${id}`, data),
  delete: (id) => api.delete(`/questionnaires/${id}`)
};

// Answers
export const answerService = {
  submit: (data) => api.post('/answers/submit', data),
  getMyAnswers: () => api.get('/answers/my-answers'),
  getByDiscipline: (disciplineId) => api.get(`/answers/discipline/${disciplineId}`),
  getRankingByDiscipline: (disciplineId) => api.get(`/answers/ranking/${disciplineId}`),
  getRankingByQuestionnaire: (questionnaireId) => api.get(`/answers/ranking/questionnaire/${questionnaireId}`),
  getGeneralRanking: () => api.get('/answers/ranking/general')
};

export default api;
