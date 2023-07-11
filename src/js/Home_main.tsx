import React,{useState,useEffect} from 'react';
import {NavLink } from "react-router-dom";
import styles from '../css/Home.module.css'
import headers from "../css/header.module.css";
import { db } from './db';
import { collection, onSnapshot, doc, getDocs, updateDoc} from 'firebase/firestore';
import { useForm, SubmitHandler } from 'react-hook-form';

// データーベースへの接続
type User = {
  memo: string;
};


export default function SimpleTabs() {
  const [users, setUsers] = useState<User[]>([]);
  const { register,
          handleSubmit,
          watch,
          formState: { errors }
        } = useForm<User>();
  
  const onSubmit: SubmitHandler<User> = async (data)  => {
    const userCollectionRef = collection(db, 'memo');
    // const q = query(userCollectionRef, where('memo', '==', data));
    const querySnapshot = await getDocs(userCollectionRef);
    querySnapshot.forEach(async (document) => {
      const userDocumentRef = doc(db, 'memo', document.id);
      await updateDoc(userDocumentRef, data);
      console.log(data)
    });
  };

// 所得
  useEffect(() => {
    
    let userList: User[] = [];
    const usersCollectionRef = collection(db, 'memo');
    const unsub = onSnapshot(usersCollectionRef, (querySnapshot) => {
      querySnapshot.docs.map((doc) => {
        const user: User= {
          memo: doc.data().memo,
        };
        userList.push(user);
      });
      setUsers(userList);
    });
    return unsub;
  });
  return (
    <>
    <header>
      <div  className={headers.header}>
      <h1 className={headers.header_logo}><a href="/">kinos</a></h1>
      </div>
      <nav className={headers.header_subtitle}>
      <ul className={headers.subtitle_ul}>
        <li className={headers.subtitle_li_Blue}><a href="/React">React</a></li>
        <li className={headers.subtitle_li_Blue}><a href="/React_error">error</a></li>
        <li className={headers.subtitle_li_Orange}><a href="/Vue">Vue</a></li>
        <li className={headers.subtitle_li_Orange}><a href="/Vue_error">error</a></li>
      </ul>
    </nav>
    </header>
    <div className={styles.main}>
        <h1 className={styles.title}>会社名・チーム名など</h1>
        <div className={styles.modal_open}><a href="#modal">•••</a></div>
          <div className={styles.modal} id="modal">
            <a href="#!" className={styles.overlay}></a>
            <div className={styles.modal_wrapper}>
              <div className={styles.modal_contents}>
                <a href="#!" className={styles.modal_close}>✕</a>
                <div className={styles.modal_content}>
                  <a className={styles.model_title}>編集</a><br/>
                </div>
                <div className={styles.area_size}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.area_size}>
                      <textarea className={styles.area} defaultValue="" {...register('memo')} />
                    </div>
                    {errors.memo && (
                      <span>Error!!!</span>
                    )}
                    <center><input className={styles.model_button} value="登録" type="submit" /></center>
                  </form >

                </div>
                
              </div>
            </div>
        </div>
        {users.map((user, index, key) => (
             <center><div key={index.toString()} className={styles.content}>{user.memo}</div></center>
        ))}
      <div className={styles.block}>
          <div className={styles.surround}>
            <h2>React</h2>
            <p><NavLink to="/React">technology</NavLink></p>
            <p><NavLink to="/React_error">error</NavLink></p>
          </div>
          <div className={styles.surround}>
            <h2>Vue.js</h2>
            <p><NavLink to="/Vue">technology</NavLink></p>
            <p><NavLink to="/Vue_error">error</NavLink></p>
          </div>
        </div>
    </div>
    </>
  );
}
