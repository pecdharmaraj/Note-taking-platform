//import logo from './logo.svg';
import { useEffect, useState } from 'react';
import LoginModal from './components/LoginModel';
import NavBar from './components/NavBar';
import SignUpModal from './components/SignUpModel';
import { User } from './models/user';
import * as NotesApi from "./network/notes_api";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import NotesPage from './pages/NotesPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFoundPage from './pages/NotFoundPage';
import styles from "./styles/App.module.css";
function App() {
  
  const [loggedInUser,setLoggedInUser]=useState<User|null>(null);
  const [showSignUpModal,setShowSignUpModel]=useState(false);
  const [showLoginModal,setShowLoginModel]=useState(false);
  useEffect(()=>{
    async function fetchLoggedInUser() {
       try {
          const user=await NotesApi.getLoggedInUser();
          setLoggedInUser(user);
       } catch (error) {
          console.error(error);
       }
    }
    fetchLoggedInUser();
  },[]);
  return (
    <BrowserRouter>
      <div>
        <NavBar
          loggedInUser={loggedInUser}
          onLoginClicked={()=>setShowLoginModel(true)}
          onSignUpClicked={()=>setShowSignUpModel(true)}
          onLogoutSuccessful={()=>setLoggedInUser(null)}
        />
      <Container className={styles.pageContainer}>
        <Routes>
          <Route
            path="/"
            element={<NotesPage loggedInUser={loggedInUser}/>}
          />
          <Route
            path="/privacy"
            element={<PrivacyPage/>}
          />
          <Route
            path="/*"
            element={<NotFoundPage/>}
          />
        </Routes>
      </Container>
      {
          showSignUpModal &&
          <SignUpModal
          onDismiss={()=>setShowSignUpModel(false)}
          onSignUpSuccessful={(user)=>{
            setLoggedInUser(user);
            setShowSignUpModel(false);
          }}
          />
        }
        {
          showLoginModal &&
          <LoginModal
          onDismiss={()=>setShowLoginModel(false)}
          onLoginSuccessful={(user)=>{
            setLoggedInUser(user);
            setShowLoginModel(false);
          }}
          />
        }
      </div>
    </BrowserRouter>
  );
}

export default App;
