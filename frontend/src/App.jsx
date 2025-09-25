import MainLayout from "./components/layout/MainLayout";
import NotFound404 from "./page/404/NotFound404";
import Author from "./page/admin/author/Author";
import Book from "./page/admin/book/Book";
import {BrowserRouter , Routes , Route} from "react-router-dom";
import Employees from "./page/admin/employee/Employees";
import Inventory from "./page/admin/inventory/Inventory";
import Order from "./page/admin/order/Order";
import User from "./page/admin/user/User";
import MainLoginLayout from "./components/layout/MainLoginLayout";
import LoginPage from "./page/admin/auth/LoginPage";
import RegisterPage from "./page/admin/auth/RegisterPage";
import HomePage from "./page/admin/home/HomePage";

function App() {

  return (
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout/>}>
            <Route path="/" element = {<HomePage/>} />
            <Route path="/author" element = {<Author/>} />
            <Route path="/book" element = {<Book/>}/>
            <Route path="/employees" element = {<Employees/>}/>
            <Route path="/inventory" element = {<Inventory/>}/>
            <Route path="/order" element = {<Order/>}/>
            <Route path="/user" element = {<User/>}/>
            <Route path="*" element = {<NotFound404/>}/>
          </Route>
          
          <Route element={<MainLoginLayout/>}>
            <Route path="/login" element= {<LoginPage/>} />
            <Route path="/register" element= {<RegisterPage/>} />
            <Route path="*" element = {<NotFound404/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
  )
}

export default App
