import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function IntroductionId() {
  const { id } = useParams(); // URL 파라미터에서 id를 가져옴
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [noticeTime, setNoticeTime] = useState('');

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const response = await axios.get(`http://your-api-url/notice/${id}`);
        setTitle(response.data.title);
        setContent(response.data.content);
        setFile(response.data.file || null);
        setNoticeTime(response.data.notice_time || '');
      } catch (error) {
        console.error('Error fetching notice:', error);
      }
    };
    fetchNotice();
  }, [id]);

  return (
    <div>
      <h1>Notice Details</h1>
      <p>Title: {title}</p>
      <p>Content: {content}</p>
      {/* Additional details */}
    </div>
  );
}

export default IntroductionId;