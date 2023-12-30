import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../Main/header/header";
import { useAuth } from "./AuthContext";
import "./Login.css";
import cookie from "react-cookies";

function Login() {
  const address = "http://192.168.0.4:8080/api/";
  const LoginAddress =
    "https://port-0-djangoproject-umnqdut2blqqevwyb.sel4.cloudtype.app/login/";
  const { setLoginInfo } = useAuth();
  const expires = new Date();

  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });

  const [isRequesting, setIsRequesting] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  const getAccessToken = async () => {
    try {
      const savedAccessToken = cookie.load("accessToken");
      const savedRefreshToken = cookie.load("refreshToken");
      setAccessToken(savedAccessToken);
      setRefreshToken(savedRefreshToken);

      console.log("Trying to get access token...");

      const getAccessTokenResponse = await axios.post(
        `${LoginAddress}`,
        {
          access: savedAccessToken,
          refresh: savedRefreshToken,
        }
      );

      console.log("Get Access Token Response:", getAccessTokenResponse.data);

      // setAccessToken(getAccessTokenResponse.data.access);

      console.log("Access Token:", getAccessTokenResponse.data.access);
      cookie.save("accessToken", getAccessTokenResponse.data.access, {
        path: "/",
        expires: new Date(getAccessTokenResponse.data.access),
      });
    } catch (error) {
      console.error("Error checking access token:", error);
    }
  };

  // 최초 렌더링 시 또는 토큰이 있을 경우 한 번 호출
  useEffect(() => {
    getAccessToken();
  }, []);

  const FormEvent = async (event) => {
    event.preventDefault();

    if (isRequesting) {
      console.log("Login request is already in progress. Ignoring.");
      return;
    }

    setIsRequesting(true);

    try {
      const loginResponse = await axios.post(
        `${LoginAddress}`,
        {
          username: userData.username,
          password: userData.password,
        }
      );
      console.log("Server Response:", loginResponse.data);

      setAccessToken(loginResponse.data.access);
      setRefreshToken(loginResponse.data.refresh);

      cookie.save("accessToken", loginResponse.data.access, {
        path: "/",
        expires: new Date(loginResponse.data.access),
      });

      cookie.save("refreshToken", loginResponse.data.refresh, {
        path: "/",
        expires: new Date(loginResponse.data.refresh),
      });

      console.log("Login Response:", loginResponse.data);

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsRequesting(false);
    }
  };

  const changeId = (value) => {
    setUserData({ ...userData, username: value });
  };

  const changePw = (value) => {
    setUserData({ ...userData, password: value });
  };

  return (
    <>
      <Header />
      <div className="login_Border">
        <div className="login_state">
          <form onSubmit={FormEvent}>
            <label htmlFor="id">ID:</label>
            <input
              type="text"
              id="id"
              name="id"
              value={userData.username}
              onChange={(e) => changeId(e.target.value)}
            />

            <label htmlFor="pw">PW:</label>
            <input
              type="password"
              id="pw"
              name="pw"
              value={userData.password}
              onChange={(e) => changePw(e.target.value)}
            />

            <div className="login_Button">
              <button type="submit">Login</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
