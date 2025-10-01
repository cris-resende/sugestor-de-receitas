import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/authentication/Login';
import Register from './pages/authentication/Register';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} /> {}
      </Routes>
    </BrowserRouter>
  );
}

export default App;