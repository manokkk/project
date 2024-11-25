
import './App.css';
//import Navbar from './Components/Navbar/Navbar';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Home from './Pages/Home';
import Shop from './Pages/Shop';
import Category from './Pages/Category';
import About from './Pages/About';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';  // Correct import for LoginSignup
import SignUp from './Components/SignUp/SignUp';

import Admin from './Admin Pages/Admin'
import Add_Product from './Admin Pages/Add_Product';
import ListProduct from './Admin Components/ListProduct/ListProduct';
import AdminCategory from './Admin Components/AdminCategory/AdminCategory';


//import Footer from './Components/Footer/Footer';
import smartphone_banner from './Components/Assets/banner_smartphone.png'
import laptop_banner from './Components/Assets/banner_laptop.png'
import wearable_banner from './Components/Assets/banner_wearable.png'
import camera_banner from './Components/Assets/banner_camera.png'


import EditProfile from './Pages/UserUpdateProfile';
import Categories from './Pages/Categories';
import Orders from './Admin Pages/Order';
import Orderhistory from './Pages/OrderHistory';


function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
      <Route path="/" element={<LoginSignup />} /> {/* Use LoginSignup here */}
        <Route path='/shop' element={<Shop />}/>
        <Route path='/category' element={<Categories/>}/>
        <Route path='/category/smartphones' element={<Category banner={smartphone_banner} category="smartphones"/>}/>
        <Route path='/category/laptops' element={<Category banner={laptop_banner} category="laptops"/>}/>
        <Route path='/category/wearables' element={<Category banner={wearable_banner} category="wearables"/>}/>
        <Route path='/category/cameras' element={<Category banner={camera_banner} category="cameras"/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path="/product" element={<Product/>}>
          <Route path=':productId' element={<Product/>}/>
        </Route>
        <Route path='/cart' element={<Cart/>}/> 
        <Route path='/login' element={<LoginSignup/>}/>
        <Route path='/signup' element={<SignUp/>}/>

        <Route path='/admin' element={<Admin/>}/>
        <Route path='/addproduct' element={<Add_Product/>}/>
        <Route path='/listproduct' element={<ListProduct/>}/>
        <Route path='/admin-category' element={<AdminCategory/>}/>
        
        
        <Route path='/home' element={<Home/>}/>
        <Route path='/user/profile' element={<EditProfile/>}/>
        <Route path='/orders' element={<Orders/>}/>
        <Route path='/orderhistory' element={<Orderhistory/>}/>

      </Routes>
      </BrowserRouter>
      

    </div>
  );
}

export default App;
