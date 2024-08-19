import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import Login from './Pages/Login'
import AdminLogin from './Pages/AdminLogin'
import Register from './Pages/Register'
import Dashboard from './Pages/Dashboard'
import Search from './Pages/Search'

import Policy from './Components/Policy';
import Actions from './Components/Actions';
import Menus from './Components/Menus';
import Devices from './Components/Devices';
import DeviceStatus from './Components/DeviceStatus';
import Previliges from './Components/Previliges';
import Schools from './Components/Schools'
import Users from './Components/Users';
import './style.css';
import { Link, Routes } from "react-router-dom";
import{ SessionContext} from './Context/SessionContext'

import {
  BrowserRouter,
  Route,
} from 'react-router-dom';


function AppWrapper() {
  const [session, setSession] = useState("");

  return (
    <div className="container-fluid">
      <SessionContext.Provider value={{ session, setSession }}>
        <BrowserRouter>
          <Routes>
            <Route index path='/' element={<Login />} />
            <Route index path='/login' element={<Login />} />
            <Route path='/admin' element={<AdminLogin />} />
            <Route path='/register' element={<Register />} />

            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/search' element={<Search />} />

            <Route path='/managedevices' element={<Devices />} />
            <Route path='/managedevicestatus' element={<DeviceStatus />} />
            <Route path='/managepreviliges' element={<Previliges />} />
            <Route path='/manageschools' element={<Schools />} />
            <Route path='/manageusers' element={<Users />} />
            <Route path='/manageactions' element={<Actions />} />
            <Route path='/managemenus' element={<Menus />} />
            <Route path='/managepolicies' element={<Policy />} />

          </Routes>
        </BrowserRouter>
      </SessionContext.Provider>
    </div >
  );




  // return (
  //     <SessionContext.Provider value={{ session }}>
  //         <BrowserRouter basename={window.location.href.includes('localhost:') ? '/' : process.env.PUBLIC_URL}>
  //             <div className="container-fluid ">
  //                 {/* {state?.session?.data?.length > 0 ? <><Header /><Sidebar /></>:<Login />} */}
  //                 <div className="row borderTop mt-1 ">
  //                     <div className="col min-vh-100  p-2 ">
  //                         <Routes>
  //                             {
  //                                 routes.map(route => {
  //                                     <Route
  //                                         key={route.path}
  //                                         path={route.path}
  //                                         component={route.component}
  //                                     />
  //                                 })
  //                             }
  //                         </Routes>
  //                     </div>/8
  //                 </div>
  //             </div>
  //         </BrowserRouter>
  //     </SessionContext.Provider >
  // );
}

export default AppWrapper;
