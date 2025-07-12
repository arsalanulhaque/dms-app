import "bootstrap/dist/css/bootstrap.min.css";
import Login from './Pages/Login'
import AdminLogin from './Pages/AdminLogin'
import Register from './Pages/Register'
import Dashboard from './Pages/Dashboard'
import Search from './Pages/Search'

import Policy from './Components/Policy';
import Actions from './Components/Actions';
import Menus from './Components/Menus';
import Devices from './Components/Devices';
import DevicesBulk from './Components/DevicesBulk';
import DeviceStatus from './Components/DeviceStatus';
import Previliges from './Components/Previliges';
import Schools from './Components/Schools'
import Users from './Components/Users';
import WeeklyReport from './Components/WeeklyReport';
import ReminderSettings from './Components/ReminderSettings';
import './style.css';
import {  Routes } from "react-router-dom";
import { BrowserRouter, Route, } from 'react-router-dom';


function AppWrapper() {

  return (
    <div className="container-fluid">
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
          <Route path='/uploadbulkdevices' element={<DevicesBulk />} />
          <Route path='/weekly-report' element={<WeeklyReport />} />
          <Route path='/reminder-settings' element={<ReminderSettings />} />
          
        </Routes>
      </BrowserRouter>
    </div >
  );
}

export default AppWrapper;
