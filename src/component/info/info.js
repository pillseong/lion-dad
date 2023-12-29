import React, { useState, useEffect } from 'react';
import Header from '../Main/header/header';
import cookie from 'react-cookies';
import axios from 'axios';

async function fetchData(accessAddress, accessToken, refreshToken, setAccessToken, setRefreshToken) {
  try {
    const getAccessTokenResponse = await axios.post(
      `${accessAddress}token/verify/`,
      { token: accessToken }
    );
    const studentId = getAccessTokenResponse.data.student_id;
    console.log('Student ID:', studentId);
  } catch (error) {
    // 액세스 토큰이 만료된 경우 리프래시 토큰으로 새로고침 시도
    try {
      const refreshTokenResponse = await axios.post(
        `${accessAddress}token/refresh/`,
        { refresh: refreshToken }
      );

      cookie.save("accessToken", refreshTokenResponse.data.access, {
        path: "/",
      });

      // 여기서 setAccessToken, setRefreshToken 함수가 정의되어 있는지 확인
      if (setAccessToken && setRefreshToken) {
        setAccessToken(refreshTokenResponse.data.access);
        const refreshedStudentInfoResponse = await axios.post(
          `${accessAddress}token/verify/`,
          { token: refreshTokenResponse.data.access }
        );

        console.log(
          "Refreshed Student Info Response:",
          refreshedStudentInfoResponse.data
        );

        const validateRefreshToken = await axios.post(
          `${accessAddress}token/`,
          {
            refresh: refreshTokenResponse.data.refresh,
          }
        );
        console.log(
          "Validate Refresh Token Response:",
          validateRefreshToken.data
        );
      } else {
        console.error('setAccessToken or setRefreshToken is not defined.');
      }
    } catch (refreshError) {
      console.error('Error refreshing token:', refreshError);
    }
  }
}

function My_info() {
  const accessAddress = 'http://192.168.0.4:8080/api/';

  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  useEffect(() => {
    const fetchDataWrapper = async () => {
      const savedAccessToken = await cookie.load('accessToken');
      const savedRefreshToken = await cookie.load('refreshToken');

      setAccessToken(savedAccessToken);
      setRefreshToken(savedRefreshToken);

      console.log('Access Token from Cookie:', savedAccessToken);
      console.log('Refresh Token from Cookie:', savedRefreshToken);

      await fetchData(accessAddress, savedAccessToken, savedRefreshToken, setAccessToken, setRefreshToken);
    };

    fetchDataWrapper();
  }, []);

  return (
    <>
      <Header />
      <h1>여긴 내정보 페이지</h1>
    </>
  );
}

export default My_info;
