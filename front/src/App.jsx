import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Home from './pages/Home'
import Sobre from './pages/Sobre'
import Login from './pages/Login'
import Register from './pages/Register'
import ProfessorDashboard from './pages/ProfessorDashboard'
import ProfessorDisciplineDetail from './pages/ProfessorDisciplineDetail'
import CreateQuestionnaire from './pages/CreateQuestionnaire'
import StudentDashboard from './pages/StudentDashboard'
import StudentDisciplineDetail from './pages/StudentDisciplineDetail'
import StudentProfile from './pages/StudentProfile'
import AnswerQuestionnaire from './pages/AnswerQuestionnaire'
import GeneralRanking from './pages/GeneralRanking'
import DisciplineRanking from './pages/DisciplineRanking'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Professor Routes */}
          <Route path="/professor" element={<ProfessorDashboard />} />
          <Route path="/professor/disciplina/:id" element={<ProfessorDisciplineDetail />} />
          <Route path="/professor/disciplina/:disciplineId/novo-questionario" element={<CreateQuestionnaire />} />
          
          {/* Student Routes */}
          <Route path="/aluno" element={<StudentDashboard />} />
          <Route path="/aluno/perfil" element={<StudentProfile />} />
          <Route path="/aluno/disciplina/:disciplineId/ranking" element={<DisciplineRanking />} />
          <Route path="/aluno/disciplina/:id" element={<StudentDisciplineDetail />} />
          <Route path="/aluno/ranking-geral" element={<GeneralRanking />} />
          <Route path="/aluno/responder/:questionnaireId" element={<AnswerQuestionnaire />} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
