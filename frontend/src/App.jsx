import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
// Pages
// import Register from './components/pages/Auth/Register'
// import Login from './components/pages/Auth/Login'
// import Welcome from './components/pages/Welcome'
// import Home from './components/pages/Home'
// Rotas privadas
// import PrivateRoute from './components/PrivateRoute';
/* contexts */
// import { UserProvider } from './context/UserContext'

function App() {
  return (
    <Router>
      {/* <UserProvider> */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/" element={<Welcome />} /> */}

          {/* Rotas protegidas */}
          {/* <Route path="/editUser" element={
            <PrivateRoute><EditUser /></PrivateRoute>
          } />
          <Route path="/diet" element={
            <PrivateRoute><Diet /></PrivateRoute>
          } />
          <Route path="/training" element={
            <PrivateRoute><Training /></PrivateRoute>
          } />
          <Route path="/gerenciador" element={
            <PrivateRoute><Gerenciador /></PrivateRoute>
          } /> */}
          {/* <Route path="/home" element={
            <PrivateRoute><Home /></PrivateRoute>
          } /> */}

        </Routes>
      {/* </UserProvider> */}
    </Router>
  )
}

export default App
