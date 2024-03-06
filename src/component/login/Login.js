import React, { useState, useEffect } from "react";
import cookie from "react-cookies";
import axios from "axios";

import "./Login.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Login() {
  const address = "http://192.168.0.4:8080/api/";
  const LoginAddress = "http://15.164.190.171/login/";
  const expires = new Date();

  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });
  const navigate=useNavigate()
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

      navigate('/'); //로그인 성공시 메인페이지로 이동
      

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
  useEffect(() => {
    // 페이지 컴포넌트가 마운트될 때 스크롤 막기 스타일을 body에 추가
    document.body.classList.add('page-without-scroll');

 // 페이지 컴포넌트가 언마운트될 때 스크롤 막기 스타일을 body에서 제거
 return () => {
  document.body.classList.remove('page-without-scroll');
};
}, []); // 빈 의존성 배열은 컴포넌트가 마운트될 때 한 번만 실행

// 나머지 코드는 그대로 둡니다.

  return (
    <>
  
      <div className="login_body">
      <div className="login_Border">
     <div className="login_title">
      <h2>LIKE LION</h2>
      <h3>12TH</h3>
      <h4> <span>with</span> Hanbat Univ</h4>
     </div>
        <div className="login_state">
          {/* 폼 제출 시 FormEvent 함수 호출 */}
          <div className="Login_menu"></div>
          <h2 className="Login">LOGIN</h2>
          <div className="login_menu">
          <form onSubmit={FormEvent}>
            <label className="Id" htmlFor="id">ID</label>
            {/* 사용자 ID 입력 필드 */}
            <input
              type="text"
              id="id"
              name="id"
              value={userData .student_id}
              onChange={(e) => changeId(e.target.value)}
              placeholder="Student number"
              className="id__input"
            />

            <label className="Pw" htmlFor="pw">Password</label>
            {/* 사용자 비밀번호 입력 필드 */}
            <input
              type="password"
              id="pw"
              name="pw"
              value={userData.password}
              onChange={(e) => changePw(e.target.value)}
              placeholder="Password"
              className="pw__input"
            />  
            <hr className="Login-line"/> 
            <div className="state_font_box">
           <a className="state_font1" href="https://forms.gle/smFDKNMACwrsK1JMA">Let's join Like lion_12th</a>
           <Link  className="state_font2" to="/Notice">Let's introduce Like Lion_12th</Link>
            </div>
            {/* 로그인 버튼 */}
            <div className="login_Button">
              <button type="submit">LOGIN</button>
            </div>
          </form>
        </div>
        </div>
      </div>
      <div className="bottom">This page copyrighted to <span>Hanbat University Lion</span> management</div>
      </div>
    </>
  );
}

export default Login;