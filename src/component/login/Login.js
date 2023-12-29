import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../Main/header/header";
import { useAuth } from "./AuthContext";
import "./Login.css";
import cookie from "react-cookies";

function Login() {
  const address = "http://192.168.0.4:8080/api/"
  const { setLoginInfo } = useAuth();

  // 사용자 데이터와 학생 정보를 상태로 관리
  const [userData, setUserData] = useState({
    student_id: "",
    password: "",
  });

  const [studentInfo, setStudentInfo] = useState(null);
  const [isRequesting, setIsRequesting] = useState(false);

  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  useEffect(() => {
    const savedAccessToken = cookie.load("accessToken");
    const savedRefreshToken = cookie.load("refreshToken");

    // 상태 업데이트
    setAccessToken(savedAccessToken);
    setRefreshToken(savedRefreshToken);

    // 여기서 필요에 따라 가져온 토큰 값을 활용할 수 있습니다.
    console.log("Access Token from Cookie:", savedAccessToken);
    console.log("Refresh Token from Cookie:", savedRefreshToken);
  }, []); // 빈 배열은 componentDidMount처럼 최초에만 실행됨


  // 폼을 제출할 때 동작하는 함수
  const FormEvent = async (event) => {
    event.preventDefault();

    if (isRequesting) {
      console.log("Login request is already in progress. Ignoring.");
      return;
    }

    // 중복 요청 방지 상태 업데이트
    setIsRequesting(true);

    try {
      // 로그인 요청 및 응답 저장
      const loginResponse = await axios.post(
        `${address}token/`,
        {
          student_id: userData.student_id,
          password: userData.password,
        }
      );
      setAccessToken(loginResponse.data.access);
      setRefreshToken(loginResponse.data.refresh);

      // 액세스 토큰과 리프래시 토큰을 쿠키에 저장
      cookie.save("accessToken", loginResponse.data.access, {
        path: "/",
        expires,
      });
      cookie.save("refreshToken", loginResponse.data.refresh, {
        path: "/",
        expires,
      });

      // 액세스 토큰의 유효성을 확인하는 요청
      const getAccessTokenResponse = await axios.post(
        `${address}token/verify/`
      , { token: accessToken });
      try {
        if (getAccessTokenResponse.status === 200) {
          const studentId = getAccessTokenResponse.data.student_id;
          console.log('Student ID:', studentId);

        } else {
          // 액세스 토큰이 만료된 경우 리프래시 토큰으로 새로고침 시도
          const refreshTokenResponse = await axios.post(
            `${address}token/refresh/`,
            {
              refresh: refreshToken,
            }
          );

          // 리프래시된 액세스 토큰을 저장
          cookie.save("accessToken", refreshTokenResponse.data.access, {
            path: "/",
            expires,
          });
          setAccessToken(refreshTokenResponse.data.access);

          // 리프래시된 토큰으로 다시 학생 정보를 가져옴
          const getAccessTokenResponse = await axios.post(
            `${address}token/verify/`
          , { token: accessToken });

          // 학생 정보 출력
          console.log(
            "Refreshed Student Info Response:",
            refreshedStudentInfoResponse.data
          );
          setStudentInfo(refreshedStudentInfoResponse.data);

          // 새로고침된 토큰을 서버에 다시 보내는 예시 요청
          const validateRefreshToken = await axios.post(
            `${address}token/`,
            {
              refresh: refreshTokenResponse.data.refresh,
            }
          );
          console.log(
            "Validate Refresh Token Response:",
            validateRefreshToken.data
          );
        }

        // 로그인 정보 출력
        console.log("Login Response:", loginResponse.data);
        setLoginInfo(loginResponse.data);
      } catch (error) {
        // 에러가 발생하면 콘솔에 에러 메시지 출력
        console.error("Error:", error);
      }
    } catch (error) {
      // 에러가 발생하면 콘솔에 에러 메시지 출력
      console.error("Error:", error);
    }
  };

  // 사용자 ID 변경 함수
  const changeId = (value) => {
    setUserData({ ...userData, student_id: value });
  };

  const changePw = (value) => {
    setUserData({ ...userData, password: value });
  };
  return (
    <>
      <Header />
      <div className="login_Border">
        <div className="login_state">
          {/* 폼 제출 시 FormEvent 함수 호출 */}
          <form onSubmit={FormEvent}>
            <label htmlFor="id">ID:</label>
            {/* 사용자 ID 입력 필드 */}
            <input
              type="text"
              id="id"
              name="id"
              value={userData.student_id}
              onChange={(e) => changeId(e.target.value)}
            />

            <label htmlFor="pw">PW:</label>
            {/* 사용자 비밀번호 입력 필드 */}
            <input
              type="password"
              id="pw"
              name="pw"
              value={userData.password}
              onChange={(e) => changePw(e.target.value)}
            />

            {/* 로그인 버튼 */}
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