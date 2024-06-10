import Login from '../Pages/AdminLogin'
import Dashboard from '../Pages/Dashboard'
import Home from '../Pages/Search'
import DeviceStatus from '../Components/DeviceStatus'
import Devices from '../Components/Devices'
import Previliges from '../Components/Previliges'
import Schools from '../Components/Schools'
import Users from '../Components/Users'
import Search from '../Pages/Search'
import Actions from '../Components/Actions'
import Menus from '../Components/Menus'
import Policy from '../Components/Policy'

const routes = [
  { path: '/', component: Login },
  { path: '/login', component: Login, },
  { path: '/dashboard', component: Dashboard },
  { path: '/search', component: Search },
  { path: '/managedevices', component: Devices },
  { path: '/managedevicestatus', component: DeviceStatus },
  { path: '/managepreviliges', component: Previliges },
  { path: '/manageschools', component: Schools },
  { path: '/manageusers', component: Users },
  { path: '/manageaction', component: Actions },
  { path: '/managemenus', component: Menus },
  { path: '/managepolicy', component: Policy },
]
export default routes