import React,{useState,useEffect} from 'react';
import {NavLink } from "react-router-dom";
import styles from '../css/Home.module.css'
import headers from "../css/header.module.css";
import { signInWithPopup } from 'firebase/auth';
import { db ,auth, provider } from './db';
import { collection, onSnapshot, doc, getDocs, updateDoc} from 'firebase/firestore';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuthState } from "react-firebase-hooks/auth"

import ReactMarkdown from 'react-markdown';
  



export const SignInButton = async () => {


    try {
        await signInWithPopup(auth, provider)

    } catch (error) {
        alert(error)
    }
}

// ログアウト
export const SignOutButton = async () => {

try {
    await auth.signOut()
} catch (error) {
    alert(error)
}
}


  

  





