import './App.css';
import { Home } from 'pages/Home';
import { Routes, Route } from "react-router-dom";
import { Login } from 'pages/Login';
import { Register } from 'pages/Register';
import { AuthProvider } from 'contexts/authContext';
import { Logout } from 'pages/Logout';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
