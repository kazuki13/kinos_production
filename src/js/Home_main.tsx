import React,{useState,useEffect} from 'react';
import {NavLink } from "react-router-dom";
import styles from '../css/Home.module.css'
import headers from "../css/header.module.css";
import { db ,auth, provider } from './db';
import { collection, onSnapshot, doc, getDocs, updateDoc} from 'firebase/firestore';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuthState } from "react-firebase-hooks/auth"
import Brack from './image/logout_brack.jpeg'
import light from './image/logout_light.jpeg'
import kinos_logo from './image/kinos_logo.jpeg'
import Google_logo from './image/google_logo.png'
import {SignOutButton,SignInButton } from './database';



// データーベースへの接続
type User = {
  memo: string;
};

// user情報
function User_photo() {
  return(
    <div>
      <div className={headers.user_photo_center}><img className={headers.user_photo} src ={auth.currentUser?.photoURL ?? ''} alt=""/></div>
    </div>
  );
}

// user情報
function UserInfo() {
  return(
    <div>
      <p>{auth.currentUser?.displayName}</p>
      <p>{auth.currentUser?.email}</p>
    </div>
  );
}


// https://www.asobou.co.jp/blog/web/css-dropdown
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

  const [ user ] = useAuthState(auth);

  return (
    <>
      {user ? (
        <>
          <header className={headers.top}>
            <div  className={headers.header}>
              <h1 className={headers.header_logo}><a><NavLink to = "/">kinos</NavLink></a></h1>
              <div className={headers.gnavi__wrap}>
                <div className={headers.gnavi__lists}>
                  <div className={headers.gnavi__list}>
                    <a >React</a>
                    <div className={headers.dropdown__lists}>
                      <div className={headers.dropdown__list}><a><NavLink to ="/React">technology</NavLink></a></div>
                      <div className={headers.dropdown__list}><a ><NavLink to ="/React_error">Error</NavLink></a></div>
                    </div>  
                  </div>
                  <div className={headers.gnavi__list}>
                    <a >Vue.js</a>
                      <div className={headers.dropdown__lists}>
                        <div className={headers.dropdown__list}><a><NavLink to ="/Vue">technology</NavLink></a></div>
                        <div className={headers.dropdown__list}><a ><NavLink to ="/Vue_error">Error</NavLink></a></div>
                        
                      </div>  
                  </div>
                  <div className={headers.modal_list}>
                    <a href="#modal1" className={headers.modal_open_light}><img  src={Brack} alt="サインアウト"/></a>
                    <a href="#modal1" className={headers.modal_open_brack}><img  src={light} alt="サインアウト"/></a>
                  </div>
  
                </div>             
              </div>
              <div className={headers.modal} id="modal1">
                <a href="#!1" className={headers.overlay}></a>
                <div className={headers.modal_wrapper}>
                  <div className={headers.modal_contents}>
                    <a href="#!1" className={headers.modal_close}>✕</a>
                    <div className={headers.modal_content}>
                      <div className={headers.photo}>
                        <User_photo/>
                      </div>
                      <div>
                        <UserInfo/>
                        <button  className={headers.gnavi__list_sign_top} onClick={SignOutButton}><a><NavLink to ="#!">サインアウト</NavLink></a></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <nav className={headers.header_subtitle}>
            <ul className={headers.subtitle_ul}>
              <li className={headers.subtitle_li_Blue}><a><NavLink to="/React">React</NavLink></a></li>
              <li className={headers.subtitle_li_Blue}><a><NavLink to="/React_error">error</NavLink></a></li>
              <li className={headers.subtitle_li_Orange}><a><NavLink to="/Vue">Vue.js</NavLink></a></li>
              <li className={headers.subtitle_li_Orange}><a><NavLink to="/Vue_error">error</NavLink></a></li>
            </ul>
          </nav> */}
          </header>
          <div className={styles.main}>
            <h1 className={styles.title}>会社名・チーム名など</h1>
              <div className={styles.modal_open}><a href="#modal2">•••</a></div>
              <div className={styles.modal} id="modal2">
                <a href="#!2" className={styles.overlay}></a>
                <div className={styles.modal_wrapper}>
                  <div className={styles.modal_contents}>
                    <a href="#!2" className={styles.modal_close}>✕</a>
                    <div className={styles.modal_content}>
                      編集<br/>
                    </div>
                    <div className={styles.area_size}>
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles.area_size}>
                          <textarea className={styles.area} defaultValue="" {...register('memo')} />
                        </div>
                        {errors.memo && (
                          <span>Error!!!</span>
                        )}
                        <div className={styles.modal_button}>
                          <a href="#!2" className={headers.gnavi__list_sign}>閉じる</a>
                          <input className={headers.gnavi__list_sign} value="登録" type="submit" />
                        </div>
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
                <p className={styles.Home_menu}><NavLink to="/React">・technology</NavLink></p>
                <p className={styles.Home_menu}><NavLink to="/React_error">・error</NavLink></p>
              </div>
              <div className={styles.surround}>
                <h2>Vue.js</h2>
                <p className={styles.Home_menu}><NavLink to="/Vue">・technology</NavLink></p>
                <p className={styles.Home_menu}><NavLink to="/Vue_error">・error</NavLink></p>
              </div>
            </div>
          </div>
        </>
      ):(
        <div>
          <header>
            <div  className={headers.header}>
              <h1 className={headers.header_logo}><a><NavLink to = "/">kinos</NavLink></a></h1>
              <div className={headers.gnavi__wrap}>
                <div className={headers.gnavi__lists}>
                  <div className={headers.gnavi__list}>
                    <a >React</a>
                    <div className={headers.dropdown__lists}>
                      <div className={headers.dropdown__list}><a><NavLink to ="/React">technology</NavLink></a></div>
                      <div className={headers.dropdown__list}><a ><NavLink to ="/React_error">Error</NavLink></a></div>
                    </div>  
                  </div>
                  <div className={headers.gnavi__list}>
                    <a >Vue.js</a>
                    <div className={headers.dropdown__lists}>
                      <div className={headers.dropdown__list}><a><NavLink to ="/Vue">technology</NavLink></a></div>
                      <div className={headers.dropdown__list}><a ><NavLink to ="/Vue_error">Error</NavLink></a></div>
                    </div>  
                  </div>
                </div>                 
              </div>
            </div>

          {/* <nav className={headers.header_subtitle}>
          <ul className={headers.subtitle_ul}>
          <li className={headers.subtitle_li_Blue}><a><NavLink to="/React">React</NavLink></a></li>
          <li className={headers.subtitle_li_Blue}><a><NavLink to="/React_error">error</NavLink></a></li>
          <li className={headers.subtitle_li_Orange}><a><NavLink to="/Vue">Vue.js</NavLink></a></li>
          <li className={headers.subtitle_li_Orange}><a><NavLink to="/Vue_error">error</NavLink></a></li>
          </ul>
          </nav> */}
          </header>
          <div>
            <div className={styles.kinos}>
              <a>
                <img className={styles.kinos_logo} src={kinos_logo}/>
              </a>
            </div>
            <div className={styles.Google}>
              <a onClick={SignInButton}>
                <NavLink to ="/"><img className={styles.Google_logo} src={Google_logo}/></NavLink>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
