import { BrowserRouter, Routes, Route} from "react-router-dom";
import Home from './js/Home_main'
import React2 from './js/React'
import React_error from './js/React_Error'
import Vue from './js/vue'
import Vue_error from './js/Vue_error'

import React from 'react'


class App extends React.Component {
  render(){
    return(
      <BrowserRouter>
        <Routes>
          <Route path={`/`} element={<Home />} />
          <Route path={`/React`} element={<React2 />} />
          <Route path={`/React_error`} element={<React_error />} />
          <Route path={`/Vue`} element={<Vue />} />
          <Route path={`/Vue_error`} element={<Vue_error />} />
        </Routes>
      </BrowserRouter>
    );
  };
}


export default App;