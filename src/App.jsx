import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Route,Routes } from "react-router-dom";
import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import UsersPage from "./pages/UsersPage";
import Sidebar from './components/common/Sidebar';
// import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AvisPage from "./pages/AvisPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import DemandsPage from './pages/DemandsPage';
import ConseilsPage from './pages/ConseilsPage';

function App() {
  return (
    <div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
        {/* BG*/}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900
          opacity-80">
            <div className="absolute inset-0 backdrop-blur-0-sm "></div>

          </div>
        </div>


        <Sidebar />
      <Routes>
        <Route path='/' element={<OverviewPage />}/>
        <Route path='/Products' element={<ProductsPage />}/>
        <Route path='/users' element={<UsersPage />}/>
        {/* <Route path='/sales' element={<SalesPage />}/> */}
        <Route path='/orders' element={<OrdersPage />}/>
        <Route path='/avis' element={<AvisPage />}/>
        <Route path='/analytics' element={<AnalyticsPage />}/>
        <Route path='/demands' element={<DemandsPage />}/>
        <Route path='/conseils' element={<ConseilsPage />}/>
        <Route path='/settings' element={<SettingsPage />}/>

        
      </Routes>
    </div>
  )
}

export default App
