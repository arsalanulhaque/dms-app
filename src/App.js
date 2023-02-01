import "bootstrap/dist/css/bootstrap.min.css";
import { useContext, useState, } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Pages/Login'
import Register from './Pages/Register'
import Dashboard from './Pages/Dashboard'
import Home from './Pages/Home'

import Grid from './Components/Controls/Grid'

import Devices from './Components/Devices';
import DeviceStatus from './Components/DeviceStatus';
import Previliges from './Components/Previliges';
import Schools from './Components/Schools'
import Users from './Components/Users';

function App() {
  const [state, setState] = useState([]);

  return (<></>);
    // <div className="container-fluid">
    //     <BrowserRouter>
    //       <Routes>
    //         <Route index path='/' element={<Login />} />
    //         <Route path='/login' element={<Login />} />
    //         <Route path='/register' element={<Register />} />

    //         <Route path='/dashboard' element={<Dashboard />} />
    //         <Route path='/home' element={<Home />} />

    //         <Route path='/managedevices' element={<Devices />} />
    //         <Route path='/managedevicestatus' element={<DeviceStatus />} />
    //         <Route path='/managepreviliges' element={<Previliges />} />
    //         <Route path='/manageschools' element={<Schools />} />
    //         <Route path='/manageusers' element={<Users />} />

    //         <Route path='/Grid' element={<Grid api='http://localhost:8000/school' />} />
    //       </Routes>
    //     </BrowserRouter>

    // </div >
  
}

export default App;
