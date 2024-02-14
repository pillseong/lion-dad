// IntroductionEdit.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function IntroductionEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const address = "https://port-0-likelion-12th-backend-9zxht12blqj9n2fu.sel4.cloudtype.app/";
  const student_id = 20201776;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState('');
  const [notice_time, setNoticeTime] = useState(new Date().toISOString().split('.')[0] + 'Z');

  const { myParameter } = useParams();

  const currentUrl = window.location.href;
  const lastSegment = currentUrl.match(/[^/]+$/)[0];

  
// https://port-0-likelion-12th-backend-9zxht12blqj9n2fu.sel4.cloudtype.app/notice/
// https://port-0-likelion-12th-backend-9zxht12blqj9n2fu.sel4.cloudtype.app/notice/5/

  useEffect(() => {


    const fetchNotice = async () => {
      try {
        const response = await axios.get(`${address}notice/${lastSegment}/`, { data: { student_id }});
        console.log(response.data); // 확인용 로그 추가
        setTitle(response.data.notice_title);
        setContent(response.data.notice_comment);
        setFile(response.data.file || null);
        setNoticeTime(response.data.notice_time || '');
      } catch (error) {
        console.error('Error fetching notice:', error);
      }
    };
    fetchNotice();
  }, [lastSegment]);

  const handleUpdate = async () => {
    try {
      // FormData 생성
      const formData = new FormData();
      
      // FormData에 필드 추가
      formData.append('student_id', student_id);
      formData.append('notice_title', title);
      formData.append('notice_comment', content);
      formData.append('notice_time', notice_time);
      formData.append('file', file);
  
      // axios로 PUT 요청 시 FormData 전송
      await axios.put(`${address}notice/${lastSegment}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      navigate('/introduction'); // 수정 후 다시 공지사항 페이지로 이동
    } catch (error) {
      console.error('Error updating notice:', error);
    }
  };

  const handleDelete = async () => {
    try {
      // Send a DELETE request to delete the notice
      await axios.delete(`${address}notice/${lastSegment}/`, { data: { student_id }});
      navigate('/introduction'); // 삭제 후 다시 공지사항 페이지로 이동
    } catch (error) {
      console.error('Error deleting notice:', error);
    }
  };

  return (
    <>
      <h1>공지사항 수정 페이지</h1>
      <label>Title: </label>
      {/* Input field for the title with the initial value set to the fetched title */}
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      <br />
      <label>Content: </label>
      {/* Input field for the content with the initial value set to the fetched content */}
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <br />
      <span>현재 들어가있는 파일 이미지</span>
      <img src={file} width={200} height={200}/>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      {/* 추가적인 필드들도 필요에 따라 처리 */}
      <button onClick={handleUpdate}>수정 완료</button>
      <button onClick={handleDelete}>삭제하기</button>
    </>
  );
}

export default IntroductionEdit;
