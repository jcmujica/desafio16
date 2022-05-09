import './App.css';
import { Home } from 'pages/Home';
import { Switch, Route } from "react-router-dom";
import { Login } from 'pages/Login';
import { Register } from 'pages/Register';
import { AuthProvider } from 'contexts/authContext';
import { Logout } from 'pages/Logout';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Switch>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
        </Switch>
      </AuthProvider>
    </div>
  );
}

export default App;
