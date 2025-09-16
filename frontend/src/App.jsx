import MainLayout from "./components/layout/MainLayout";
import DashboardPage from "./page/admin/dashboard/DashboardPage"
import {BrowserRouter , Routes , Route} from "react-router-dom";

function App() {

  return (
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout/>}>
          <Route path="/dasboard" element = {<DashboardPage/>} />
          </Route>
        </Routes>
      </BrowserRouter>
  )
}

export default App
