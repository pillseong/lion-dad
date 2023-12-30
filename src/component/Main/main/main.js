import "./main.css"
import Header from '../header/header';
import React, { useState, useEffect } from "react";
import cookie from "react-cookies";
import axios from "axios";
import likelionLogo from '../../images/LikeLion_Logo.png';

function Main() {
  const LoginAddress =
  "https://port-0-djangoproject-umnqdut2blqqevwyb.sel4.cloudtype.app/login/";
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [userInfo, setUserInfo] = useState([]);
  const [userDivision, serUserDivision] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [userName, setUserName] = useState(null);

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
      
      // 상태를 업데이트하고 나서 값 확인
      setUserInfo(getAccessTokenResponse.data)
      serUserDivision(getAccessTokenResponse.data.division)
      setStudentId(getAccessTokenResponse.data.username)
      setUserName(getAccessTokenResponse.data.name)

      console.log("userInfo: ", userInfo);
      console.log(userDivision, studentId, userName);

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
  useEffect(() => {
    console.log("userInfo: ", userInfo);
    console.log("userDivision, studentId, userName: ", userDivision, studentId, userName);
    serUserDivision(userDivision)
    setStudentId(studentId)
    setUserName(userName)
  }, [userInfo, userDivision, studentId, userName]);
    



    return (
        <div className="main_container">
          <img src={likelionLogo} alt="Lion Logo" className="lion-logo" />
          <div className="User_container">
            <div className="Lion_info">Lion Info</div>
            <span>school : HBNU</span>
            <span>Student_Number : {studentId}</span>
            <span>Name : {userName}</span>
            <span> Division : {userDivision}</span>
          </div>
          <Header />
        </div>
    );
}

export default Main;
