import React from 'react'
import Todo from "./components/Todo";
import { Routes, Route, useNavigate } from 'react-router-dom';
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";

function App() {
  let navigate = useNavigate();

  React.useEffect(() => {

    const isLoggedIn = window.localStorage.getItem('token') ? true : false;
    isLoggedIn ? navigate('/') : navigate('/signIn');
    
  }, [window.localStorage.getItem('token')])

  return (
    <Routes>
      <Route path="/" element={<Todo />} /> :
      <Route exact path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}

export default App;
