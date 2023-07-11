import React,{useState,useEffect,useRef} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import headers from "../css/header.module.css"
import styles from "../css/tab.module.css"
import { db } from './db';
import { addDoc, collection, onSnapshot, doc, deleteDoc, getDocs, query, where} from 'firebase/firestore';
import { useForm, SubmitHandler } from 'react-hook-form';



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

// const useStyles = makeStyles((theme: Theme) => ({
//   root: {
//     flexGrow: 1,
//     backgroundColor: theme.palette.background.paper,
//   },
// }));

export default function SimpleTabs() {
  // 選択タブ
  const [value, setValue] = React.useState(0);


  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  
//  const [Rerror, seterror] = useState<error[]>([]);
  // 登録
  const [users, setUsers] = useState<User[]>([]);
  const { register,
          handleSubmit,
          watch,
          formState: { errors }
        } = useForm<User>();

  const onSubmit: SubmitHandler<User> = (data) => {
    console.log('onSubmit', data);
    const usersCollectionRef = collection(db, 'React');
    const documentRef = addDoc(usersCollectionRef, {
      name: data.name,
      title: data.title,
      subtitle: data.subtitle,
      code: data.code,
      admin: false,
    });
    console.log(documentRef);
  };



// 所得
  useEffect(() => {
    
    let userList: User[] = [];
    const usersCollectionRef = collection(db, 'React');
    
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
  // useEffect(() => {
    
  //   let userList2: error[] = [];
  //   const usersCollectionRef2 = collection(db, 'Rerror');
  //   const unsub2 = onSnapshot(usersCollectionRef2, (querySnapshot2) => {
  //     querySnapshot2.docs.map((doc) => {
  //       const Rerror: error= {

  //         nameerror: doc.data().nameerror,
  //         titleerror: doc.data().titleerror,
  //         subtitleerror: doc.data().subtitleerror,
  //         codeerror: doc.data().codeerror,
  //       };
  //       userList2.push(Rerror);
  //     });
  //     seterror(userList2);
  //   });
  //   return unsub2;
  // });
  

  // 削除
  const deleteUser = async (title: string) => {
    const userCollectionRef = collection(db, 'React');
    const q = query(userCollectionRef, where('title', '==', title));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (document) => {
      const userDocumentRef = doc(db, 'React', document.id);
      await deleteDoc(userDocumentRef);
    });
  };
  // 編集
  // const { id, text, timestamp } = props.todo;

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
    <div className={styles.title_front}>
      <a>React</a>
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
                    <div className={styles.title}>{user.title}</div>
                    <div className={styles.name}>{user.name}</div>
                    <button className={styles.sakuzyo} key={user.title} onClick={() => deleteUser(user.title)}>削除</button>
                  </summary>
                  <div>
                    <p>〜記入者〜</p>
                    <div className={styles.name2}>{user.name}</div>
                    <p>〜タイトル〜</p>
                    <div className={styles.title2}>{user.title}</div>
                    <p>〜詳細〜</p>
                    <div className={styles.subtitle}>{user.subtitle}</div>
                    <p>〜プログラム〜</p>
                    <div className={styles.code}>{user.code}</div>
                    {/* .replaceAll('\\n', '\n') */}
                  </div>
                </details>
                </div>
        </div>
           ))}
      </TabPanel>
      
      <TabPanel value={value} index={1}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>名前（ニックネーム）</label><br/>
          <input className={styles.input_mame} defaultValue="名前" {...register('name')} />
        </div>
        <div>
          <label>タイトル</label><br/>
          <textarea className={styles.input_title} defaultValue="タイトル" {...register('title')} />
        </div>
        <div>
            <label>詳細</label><br/>
            <textarea className={styles.input_content} defaultValue="詳細" {...register('subtitle')} />
        </div>
        <div>
            <label>プログラム</label><br/>
            <textarea className={styles.input_content} defaultValue="'''ここに記入してください'''" {...register('code')} />
        </div>
        {errors.name && (
          <span>Error!!!</span>
        )}
        <input value="登録" type="submit" />
      </form>
      </TabPanel>
            
    </div>
    </>
  );
}
