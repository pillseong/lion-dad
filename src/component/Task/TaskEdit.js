// TaskEdit.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const TaskEdit = () => {
  const address = "https://port-0-likelion-12th-backend-9zxht12blqj9n2fu.sel4.cloudtype.app";
  const navigate = useNavigate();
  const { weeks } = useParams();

  const [file, setFile] = useState(null);
  const currentUrl = window.location.href;
  const lastSegment = currentUrl.match(/[^/]+$/)[0];

  const [newAssignmentData, setNewAssignmentData] = useState({
    student_id: 20201761,
    weeks: lastSegment, // URL에서 추출한 주차 정보
  });
  console.log(lastSegment);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAssignmentSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file); // 파일 추가

      // 기타 데이터 추가
      Object.entries(newAssignmentData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // 서버에 과제 생성 요청 보내기
      const response = await axios.post(`${address}/assignment/`, formData, newAssignmentData);

      console.log('Assignment submitted successfully:', response.data);
      navigate('/Task'); // 제출 후 필요한 작업 수행
    } catch (error) {
        
        console.error('Error submitting assignment:', error);
        console.log(error.response);
      // 오류 처리
    }
  };

  return (
    <div>
      <h2>과제 생성</h2>
      <form>
        {/* 다양한 입력 필드 추가 */}
        <label>
          파일 제출:
          <input type="file" onChange={handleFileChange} />
        </label>
        {/* 기타 입력 필드 추가 (주차, 년도/시간은 자동으로 설정) */}

        <button type="button" onClick={handleAssignmentSubmit}>
          과제 제출
        </button>
      </form>
    </div>
  );
};

export default TaskEdit;