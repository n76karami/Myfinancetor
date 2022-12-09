import { BrowserRouter, Routes, Route } from "react-router-dom";
import WebLayout from "./WebLayout/WebLayout";
import Home from "./WebLayout/Home";
import DashboardLayout from "./DashboardLayout/DashboardLayout";
import NotFound from "./NotFound/NotFound";
import Mydashboard from "./DashboardLayout/Mydashboard";
import Editprofile from "./DashboardLayout/Editprofile";
import Expenses from "./DashboardLayout/Expenses";
import Tags from "./DashboardLayout/_Tags";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<WebLayout />}>
            <Route path="" element={<Home />} />
          </Route>

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="" element={<Mydashboard />} />
            <Route path="editprofile/:id" element={<Editprofile />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="tags" element={<Tags />} />
          </Route>

          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
