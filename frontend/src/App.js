import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; 
import { AuthProvider } from './contexts/AuthorContext'; // Fixed import
import NavBar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import PostDetails from './pages/PostDetails';
import MyPost from './pages/MyPost';  // Removed :id from route
import Profile from './pages/Profile';
import EditPost from './pages/EditPost';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/posts/create" element={<CreatePost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/posts/edit/:id" element={<EditPost />} />
          <Route path="/my-posts" element={<MyPost />} /> 
          <Route path="/profile" element={<Profile />} /> 
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;




