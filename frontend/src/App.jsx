import { BrowserRouter as Router , Routes , Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import ReturnPolicy from './pages/ReturnPolicy'
import Disclaimer from './pages/Disclaimer'
import Login from './pages/Login'
import Register from './pages/Register'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Profile from './pages/Profile'
import AdminDashboard from './admin/AdminDashboard'
import AdminUsers from './admin/AdminUsers'
import AdminOrders from './admin/AdminOrders'
import AdminProducts from './admin/AdminProducts'
import AddProduct from './admin/AddProduct'
import EditProduct from './admin/EditProduct'
import Shop from './pages/Shop'
import VerifyOtp from './components/Verifyotp'

function App() {


  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/product/:id' element = {<ProductDetail/>}></Route>
        <Route path='/cart' element = {<Cart/>}></Route>
        <Route path='/checkout' element = {<Checkout/>}></Route>
        <Route path='/login' element = {<Login/>}></Route>
        <Route path='/register' element = {<Register/>}></Route>
        <Route path='/admin' element = {<AdminDashboard/>}></Route>
        <Route path='/admin/users' element = {<AdminUsers/>}></Route>
        <Route path='/admin/orders' element = {<AdminOrders/>}></Route>
        <Route path='/admin/products' element = {<AdminProducts/>}></Route>
        <Route path='/admin/add-product' element = {<AddProduct/>}></Route>
        <Route path='/admin/edit-product/:id' element = {<EditProduct/>}></Route>
        <Route path='/about' element={<About />}></Route>
        <Route path='/disclaimer' element={<Disclaimer/>}></Route>
        <Route path='/return' element={<ReturnPolicy />}></Route>
        <Route path='/ordersuccess' element={<OrderSuccess />}></Route>
        <Route path="/profile" element={<Profile/>}></Route>
        <Route path="/shop" element={<Shop/>}></Route>
        <Route path="/verify-otp" element={<VerifyOtp/>}></Route>
      </Routes>
      <Footer/>
    </Router>
  )
}

export default App
