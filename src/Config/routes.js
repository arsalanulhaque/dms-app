import Login from '../Pages/Login'
import Dashboard from '../Pages/Dashboard'
import Home from '../Pages/Home'
import DeviceStatus from '../Components/DeviceStatus'
import Devices from '../Components/Devices'
import Previliges from '../Components/Previliges'
import Schools from '../Components/Schools'
import Users from '../Components/Users'

const routes = [
  { path: '/', component: Login },
  { path: '/login', component: Login, },
  { path: '/dashboard', component: Dashboard },
  // { path: '/*', component: Home },
  { path: '/managedevices', component: Devices },
  { path: '/managedevicestatus', component: DeviceStatus },
  { path: '/managepreviliges', component: Previliges },
  { path: '/manageschools', component: Schools },
  { path: '/manageusers', component: Users },
]
export default routes