// IntroductionWrite.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Main/header/header';
import { useParams, useNavigate } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './IntroductionWrite.css'; 
import { useAuth } from '../Login/AuthContext';

function IntroductionWrite() {
  const { loginInfo } = useAuth();
  const student_id = "20202020";
  const address = "http://172.20.10.7:3000/";
  
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [notice_time, setNoticeTime] = useState(new Date().toISOString().split('.')[0] + 'Z'); 
  function removeHtmlTags(input) {
    return input.replace(/<[^>]*>?/gm, ''); // 정규식을 사용해 HTML 태그 제거
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // FormData 생성
    const formData = new FormData();
    // 각 필드를 FormData에 추가
    formData.append('student_id', student_id);
    const sanitizedTitle = removeHtmlTags(title);
    formData.append('notice_title', sanitizedTitle);
    const sanitizedContent = removeHtmlTags(content);
    formData.append('notice_comment', sanitizedContent);
    formData.append('notice_time', notice_time);
    formData.append('file', file);

    try {
      if (id) {
        setNoticeTime(new Date().toISOString().split('.')[0] + 'Z');
        // axios로 PUT 요청 시 FormData 전송
        await axios.put(`${address}notice/${id}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        });
      } else {
        // axios로 POST 요청 시 FormData 전송
        await axios.post(`${address}notice/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      navigate('/Notice');
    } catch (error) {
      console.error('Error submitting notice:', error.response?.data); // 에러 응답 메시지 확인
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${address}notice/${id}/`);
      navigate('/introduction');
    } catch (error) {
      console.error('Error deleting notice:', error);
    }
  };

  return (
    <div className="introduction-write-container">
      <Header />
      <h1>{id ? 'Edit Notice' : 'Create Notice'}</h1>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label>Content:</label>
        <CKEditor
          editor={ClassicEditor}
          data={content}
          onChange={(event, editor) => {
            const data = editor.getData();
            setContent(data);
          }}
        />

        {/* 추가: 파일 업로드 */}
        <label>File:</label>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />

        {/* 추가: 작성 시간 */}
        <label>Notice Time:</label>
        <input type="text" value={notice_time} onChange={(e) => setNoticeTime(e.target.value)} />

        <div className="button-container">
          <button type="submit" className="submit-button">
            {id ? 'Edit' : 'Create'}
          </button>
          {id && (
            <button type="button" className="delete-button" onClick={handleDelete}>
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default IntroductionWrite;
