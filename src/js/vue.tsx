import React,{useState,useEffect,useRef} from 'react';
import { NavLink } from "react-router-dom";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { nightOwl } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import headers from "../css/header.module.css"
import styles from "../css/tab.module.css"
import { db ,auth } from './db';
import { useAuthState } from "react-firebase-hooks/auth"
import { addDoc, collection, onSnapshot, doc, deleteDoc, getDocs, query, where} from 'firebase/firestore';
import { useForm, SubmitHandler } from 'react-hook-form';
import Brack from './image/logout_brack.jpeg'
import light from './image/logout_light.jpeg'
import kinos_logo from './image/kinos_logo.jpeg'
import {SignOutButton } from './database';

// データーベースへの接続
type User = {
  name: string;
  title:string;
  subtitle: string;
  code: string;
};

// 選択タブ
interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

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


function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3} >
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

// 項目の切り替え
function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}



export default function SimpleTabs() {
  // 選択タブ
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  
  // 所得
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    
    let userList: User[] = [];
    const usersCollectionRef = collection(db, 'Vue');
    const unsub = onSnapshot(usersCollectionRef, (querySnapshot) => {
      querySnapshot.docs.map((doc) => {
        const user: User= {
          name: doc.data().name,
          title: doc.data().title,
          subtitle: doc.data().subtitle,
          code: doc.data().code,
        };
        userList.push(user);
      });
      setUsers(userList);
    });
    
    return unsub;
  });


  // 追加
  const { register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<User>();

  const [message, setMessage] = useState('');
  const onSubmit: SubmitHandler<User> = async (data) => {
    try {
      console.log('onSubmit', data);
  
      const usersCollectionRef = collection(db, 'React');
      const documentRef = await addDoc(usersCollectionRef, {
        name: data.name,
        title: data.title,
        subtitle: data.subtitle,
        code: data.code,
        admin: false,
      });
  
      console.log('Document added with ID: ', documentRef.id);
  
      // 登録成功の場合、成功メッセージを表示
      setMessage('登録しました');
    } catch (error) {
      console.error('Error adding document:', error);
  
      // エラーメッセージを表示
      setMessage('登録に失敗しました。');
    }
  };
  
  // 削除
  const deleteUser = async (subtitle: string) => {
    const userCollectionRef = collection(db, 'Vue');
    const q = query(userCollectionRef, where('subtitle', '==', subtitle));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (document) => {
      const userDocumentRef = doc(db, 'Vue', document.id);
      await deleteDoc(userDocumentRef);
    });
  };
  // 編集
  // const { id, text, timestamp } = props.todo;
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
          <div className={styles.title_front_Vue}>
            <a>Vue.js</a>
          </div>
          <div className={styles.box1}>
            <AppBar position="static" >
              <Tabs value={value} indicatorColor="primary" onChange={handleChange} aria-label="simple tabs example" className={styles.box_title}>
                <Tab className={styles.box1_1} label="技術" {...a11yProps(0)} />
                <Tab className={styles.box1_1} label="+" {...a11yProps(1)} />
              </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
              {users.map((user, index) => (
                <div className={styles.box_main}>
                  <div key={user.name}>
                  {/* <div key={index.toString()} className={styles.box_name_top}>{user.name}</div> */}
                    <details>

                      <summary className={styles.names}>
                        <div className={styles.box}>
                          <div className={styles.title}>{user.title}</div>
                          <div className={styles.name}>{user.name}</div>
                          <div className={styles.sakuzyo}>
                            <button  className={styles.sakuzyo_button} key={user.title} onClick={() => deleteUser(user.title)}>削除</button>
                          </div>                        
                        </div>
                      </summary>

                      <div>
                        <p>〜記入者〜</p>
                        <div className={styles.name2}>{user.name}</div>
                        <p>〜タイトル〜</p>
                        <div className={styles.title2}>{user.title}</div>
                        <p>〜詳細〜</p>
                        <div className={styles.subtitle}>{user.subtitle}</div>
                        <p>〜プログラム〜</p>
                        <SyntaxHighlighter language="typescript" style={nightOwl}>
                          {user.code}
                        </SyntaxHighlighter>
                        {/* .replaceAll('\\n', '\n') */}
                      </div>
                    </details>
                  </div>
                </div>
              ))}
            </TabPanel>
      
            <TabPanel  value={value} index={1}>
              <form className={styles.center} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.center}>
                  <label>名前（ニックネーム）</label><br/>
                  <textarea className={styles.input_name} defaultValue={auth.currentUser?.displayName ?? ''} {...register('name')} />
                </div>
                <div className={styles.center}>
                  <label>タイトル</label><br/>
                  <textarea className={styles.input_title}  defaultValue="タイトル" {...register('title')} />
                </div>
                <div className={styles.center}>
                    <label>詳細</label><br/>
                    <textarea className={styles.input_content} defaultValue="詳細" {...register('subtitle')} />
                </div>
                <div className={styles.center}>
                    <label>プログラム</label><br/>
                    <textarea className={styles.input_content} defaultValue="'''ここに記入してください'''" {...register('code')} />
                </div>
                {errors.name && (
                  <span>Error!!!</span>
                )}
                {message && <div>{message}</div>}
                <div className={styles.center}>
                  <input className={styles.sakuzyo_button} value="登録" type="submit" />
                </div>
              </form>
            </TabPanel>  
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
              <img className={styles.kinos_logo} src={kinos_logo}/>
            </div>
            <div className={styles.No}>
              <a className={styles.No_data}>始めるには、ログインが必要です。topへからサインインできます。</a>
            </div>
            <NavLink to ="/">
              <div className={styles.Google}>
                <button className={headers.gnavi__list_sign} ><a>topへ</a></button>
              </div>
            </NavLink>
          </div>
        </div>
      )}
    </>
  );
}
