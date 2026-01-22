import React, { Fragment, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { routes } from "./routes/index";
import DefaultCompoment from './compoments/DefaultCompoment/DefaultCompoment';
import { isJsonString } from './utils';
import { jwtDecode } from 'jwt-decode';
import * as userService from "./services/userService";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from './redux/slices/userSlice';
import Loading from './compoments/LoadingCompoment/Loading';
import Chatbot from './compoments/chatbot/chatbot';



function App() {

  const dispatch = useDispatch();
  const [isPending, setIsPending] = useState(false)
  const user = useSelector((state) => state.user)

  const handleDecoded = () => {
    let storageData = localStorage.getItem("access_token");
    let decoded = {}
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData);
      decoded = jwtDecode(storageData);
    }
    return { decoded, storageData }
  }


  useEffect(() => {
    setIsPending(true)
    const { storageData, decoded } = handleDecoded()
    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData);
    }
    setIsPending(false)

  }, []);


  
  // true
  userService.axiosJWT.interceptors.request.use(async (config) => {
    const currentTime = new Date();
    const { decoded } = handleDecoded();
    if (decoded?.exp < currentTime.getTime() / 1000) {
      try {
        const data = await userService.refreshToken();
        config.headers['token'] = `Bearer ${data?.access_token}`;
        localStorage.setItem("access_token", JSON.stringify(data?.access_token));
      } catch (error) {
        console.error("Refresh token error:", error);
      }
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
  });


  const handleGetDetailsUser = async (id, token) => {
    const res = await userService.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };

  return (
    <div>
      <Loading isPending={isPending}>
        <Router>
          <Routes>
            {routes.map((route) => {
              const Page = route.page
              const isCheckAuth = !route.isPrivate || user.isAdmin
              const Layout = route.isShowHeader ? DefaultCompoment : Fragment
              return (
                <Route key={route.path} path={isCheckAuth ? route.path : undefined} element={
                  <Layout>
                    <Page />
                  </Layout>
                } />
              )
            })}
          </Routes>
        </Router>
      </Loading>
      <Chatbot />
    </div>
    
  )
}

export default App