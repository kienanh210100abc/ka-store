import "./App.css";
import { Routes, Route } from "react-router-dom";
import Layout from "./component/Layout/Layout";
import Login from "./page/login/Login";
import Homepage from "./page/homepage/Homepage";
import Profile from "./page/profile/Profile";
import ChangePassword from "./page/profile/ChangePassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/changePass" element={<ChangePassword />} />
          {/* <Route path="/shoes" element={<ProductList category="shoes" />} />
          <Route path="/clothes" element={<ProductList category="clothes" />} />
          <Route path="/racket" element={<ProductList category="racket" />} />
          <Route
            path="/accessory"
            element={<ProductList category="accessory" />}
          />
          <Route path="/product/:id" element={<ProductDetail />} />  */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
