// Introduction.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../Main/header/header';
import { Link } from 'react-router-dom';
import { useAuth } from '../Login/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import IntroductionEdit from './introductionEdit'; // Import the IntroductionEdit component

function Introduction() {
  const { loginInfo } = useAuth();
  const navigate = useNavigate();
  const address = "https://port-0-likelion-12th-backend-9zxht12blqj9n2fu.sel4.cloudtype.app/";

  const [notices, setNotices] = useState([]);
  const [editingId, setEditingId] = useState(null); // State to store the editing ID
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  // const [notice_time, setNoticeTime] = useState(new Date().toISOString().split('.')[0] + 'Z');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const student_id = "20201776";

  // Function to set the editing ID in local storage
  const setEditingIdInLocalStorage = (id) => {
    localStorage.setItem('editingId', id);
  };

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
      fetchNotices(); // Call fetchNotices after deletion
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
          setEditingId(id); // Set the editing ID when the component mounts
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
            {/* Link to the IntroductionEdit component with the notice id */}
            <Link
              to={`/edit-notice/${notice.id}`}
              onClick={() => setEditingIdInLocalStorage(notice.id)} // Set editing ID in local storage
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

      {/* Render IntroductionEdit component when the route matches */}
      {editingId && <IntroductionEdit />}
    </>
  );
}

export default Introduction;
