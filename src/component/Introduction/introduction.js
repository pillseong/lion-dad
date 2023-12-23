// Introduction.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../Main/header/header';
import { Link } from 'react-router-dom';
import { useAuth } from '../Login/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';

function Introduction() {
  const { loginInfo } = useAuth();
  const address = "http://172.20.10.7:3000/";

  const [notices, setNotices] = useState([]);
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [notice_time, setNoticeTime] = useState(new Date().toISOString().split('.')[0] + 'Z');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({}); // 모달 데이터 추가
  // const [ isAdmin, setIsAdmin ] = useState({True});

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get(`${address}notice/`);
        setNotices(response.data);
      } catch (error) {
        console.error('Error fetching notices:', error);
      }
    };
    fetchNotices();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchNotice = async () => {
        try {
          const response = await axios.get(`${address}notice/${id}`);
          setTitle(response.data.title);
          setContent(response.data.content);
          setFile(response.data.file || null);
          setNoticeTime(response.data.notice_time || '');
        } catch (error) {
          console.error('Error fetching notice:', error);
        }
      };
      fetchNotice();
    }
  }, [id]);

  // 모달 열기
  const openModal = (data) => {
    setModalData(data);
    setIsModalOpen(true);
  };

  // 모달 닫기
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
              {/* title 클릭 시 모달 열기 */}
              <button onClick={() => openModal(notice)}>{notice.notice_comment}</button>
            </div>
            {/* {isAdmin && (  */}
            <Link to={`${address}notice/`}>수정하기</Link>
            {/* )} */}
          </li>
        ))}
      </ul>
      <Link to="/IntroductionWrite">새로운 공지 작성</Link>

      {/* 모달 */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{modalData.notice_title}</h3>
            <p>{modalData.notice_comment}</p>
            <button onClick={closeModal}>닫기</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Introduction;
