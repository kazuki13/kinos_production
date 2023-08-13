import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from "./db";
import { useAuthState } from "react-firebase-hooks/auth"

function SignInButton() {
  const signInWithgoogle = () => {
    signInWithPopup(auth, provider);

  };

  return(
    <button onClick={signInWithgoogle}>
      <p>Googleでサインイン</p>
    </button>
  );
}

function SignOutButton() {
  return(
    <button onClick={() => auth.signOut()}>
      <p>Googleでサインアウト</p>
    </button>
  );
}

function UserInfo() {
  return(
    <div>
      <img src = {auth.currentUser.photoURL} alt="" />
      <p>{auth.currentUser.displayName}</p>
    </div>
  );
}


function Home(){
  const [ user ] = useAuthState(auth);

  return(
    <div>
      {user ? (
        <>
          <UserInfo/>
          <SignOutButton/>
        </>
      ):(
        <SignInButton/>
      )}
    </div>

  );
}

export default Home