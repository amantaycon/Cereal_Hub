
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {Login, Ragister, ForgotPassword, Logout} from "./login_view";
import HomePage from "./dashboard";
import CartPage from "./CartPage";
import Product from "./Product";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/user/login"  element={ <Login /> } />
        <Route path="/user/logout" element={<Logout />} />
        <Route path="/user/ragister" element={<Ragister />} />
        <Route path="/user/forgot_password" element={<ForgotPassword />} />
        <Route path="/user/cart" element={<CartPage />} />
        <Route path="/product/:id" element={<Product/>} />
        <Route path="*" element={<h1>404 Not Found</h1>} />

      </Routes>
    </Router>
  )
}

export default App
