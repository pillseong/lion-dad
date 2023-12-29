// Introduction.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../Main/header/header';
import { Link } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import IntroductionEdit from './introductionEdit'; 
import cookie from "react-cookies";

function Introduction() {
  const navigate = useNavigate();
  const address = "https://port-0-likelion-12th-backend-9zxht12blqj9n2fu.sel4.cloudtype.app/";
  const accessAddress = "http://192.168.0.4:8080/api/";

  const [notices, setNotices] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [studentInfo, setStudentInfo] = useState(null); // 수정된 부분
  const student_id = "20201776";

  const setEditingIdInLocalStorage = (id) => {
    localStorage.setItem('editingId', id);
  };
  
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedAccessToken = cookie.load("accessToken");
        const savedRefreshToken = cookie.load("refreshToken");

        setAccessToken(savedAccessToken);
        setRefreshToken(savedRefreshToken);

        const getAccessTokenResponse = await axios.post(
          `${accessAddress}token/verify/`,
          { token: savedAccessToken }
        );
        const studentId = getAccessTokenResponse.data.student_id;
        setStudentInfo(studentId); // 수정된 부분
        console.log('Server Response:', getAccessTokenResponse);
        console.log('Student ID:', studentId);
      } catch (error) {
        try {
          const refreshTokenResponse = await axios.post(
            `${accessAddress}token/refresh/`,
            { refresh: refreshToken }
          );

          cookie.save("accessToken", refreshTokenResponse.data.access, {
            path: "/",
          });
          setAccessToken(refreshTokenResponse.data.access);

          const refreshedStudentInfoResponse = await axios.post(
            `${accessAddress}token/verify/`,
            { token: refreshTokenResponse.data.access }
          );

          setStudentInfo(refreshedStudentInfoResponse.data.student_id); // 수정된 부분
          console.log(
            "Refreshed Student Info Response:",
            refreshedStudentInfoResponse.data
          );

          const validateRefreshToken = await axios.post(
            `${accessAddress}token/`,
            {
              refresh: refreshToken,
            }
          );
          console.log(
            "Validate Refresh Token Response:",
            validateRefreshToken.data
          );
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
        }
      }
    };

    fetchData();
  }, [accessAddress]); // 수정된 부분

  const fetchNotices = async () => {
    try {
      const response = await axios.get(`${address}notice/`);
      setNotices(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching notices:', error);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleDelete = async (id) => {
    console.log("Deleting ID:", id);
    try {
      await axios.delete(`${address}notice/${id}/`, { data: { student_id }});
      fetchNotices();
      navigate('/introduction');
    } catch (error) {
      console.error('Error deleting notice:', error);
    }
  };

  useEffect(() => {
    if (id) {
      const fetchNotice = async () => {
        try {
          const response = await axios.get(`${address}notice/${id}`);
          setTitle(response.data.title);
          setContent(response.data.content);
          setFile(response.data.file || null);
          setEditingId(id);
        } catch (error) {
          console.error('Error fetching notice:', error);
        }
      };
      fetchNotice();
    }
  }, [id]);

  const openModal = async (data) => {
    setModalData(data);
    setIsModalOpen(true);

    if (data.file) {
      try {
        setModalData((prevData) => ({
          ...prevData,
          fileUrl: data.file,
        }));
      } catch (error) {
        console.error('Error fetching file:', error);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Header />
      <h1>공지사항 페이지</h1>
      <ul>
        {notices.map((notice) => (
          <li key={notice.id}>
            <div>
              <h3>{notice.notice_title}</h3>
              <span>{notice.notice_time}</span>
              <button onClick={() => openModal(notice)}>{notice.notice_comment.slice(0, 20)}</button>
            </div>
            <Link
              to={`/edit-notice/${notice.id}`}
              onClick={() => setEditingIdInLocalStorage(notice.id)}
            >
              수정하기
            </Link>
            <button onClick={() => handleDelete(notice.id)}>삭제하기</button>
          </li>
        ))}
      </ul>
      <Link to="/IntroductionWrite">새로운 공지 작성</Link>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{modalData.notice_title}</h3>
            <p>{modalData.notice_comment}</p>
            {modalData.fileUrl && (
              <div>
                {modalData.fileUrl.endsWith('.pdf') ? (
                  <embed src={modalData.fileUrl} type="application/pdf" width="600" height="400" />
                ) : (
                  <img src={modalData.fileUrl} alt="File" style={{ maxWidth: '100%', maxHeight: '400px' }} />
                )}
              </div>
            )}
            <button onClick={closeModal}>닫기</button>
          </div>
        </div>
      )}

      {editingId && <IntroductionEdit />}
    </>
  );
}

export default Introduction;
