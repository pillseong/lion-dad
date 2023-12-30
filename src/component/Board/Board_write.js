import React, { useState, useEffect } from 'react';
import './board_test.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Header from '../Main/header/header';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import cookie from "react-cookies";


function Board_Write() {
  const navigate = useNavigate();
  const location = useLocation();

  const [movieContent, setMovieContent] = useState({
    student_id: 20201738,
    title: '',
    content: '',
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);

  const selectedBoard = location.state?.selectedBoard || 'qna';
  console.log("주소입력", selectedBoard);

  const targetBoard = selectedBoard === 'qna' ? 'qna' : 'free';
    console.log("주소확인", targetBoard);

  const apiAddresses = {
    qna: 'http://13.124.78.53/qna/questions/',
    free: 'http://13.124.78.53/free/questions/',
  };

  const address = apiAddresses[targetBoard];
  console.log(address);

  const handleTitleChange = (e) => {
    setMovieContent({
      ...movieContent,
      title: e.target.value,
    });
  };

  const handleContentChange = (e, editor) => {
    const content = editor.getData();
    setMovieContent({
      ...movieContent,
      content: content,
    });
  };

  //-----------------------------------
  const [userName, setUserName] = useState(null);
  const [userDivision, setUserDivision] = useState(null);
  const [student_Id, setStudent_Id] = useState(null);
  
  const LoginAddress = "https://port-0-djangoproject-umnqdut2blqqevwyb.sel4.cloudtype.app/login/";

  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedAccessToken = cookie.load("accessToken");
        const savedRefreshToken = cookie.load("refreshToken");
        setRefreshToken(savedRefreshToken);
        setAccessToken(savedAccessToken);
  
        console.log("Trying to get access token...");
  
        const getAccessTokenResponse = await axios.post(
          `${LoginAddress}`,
          {
            access: savedAccessToken,
            refresh: savedRefreshToken,
          }
        );
  
        console.log("Get Access Token Response:", getAccessTokenResponse.data);
        setUserName(getAccessTokenResponse.data.name);
        setUserDivision(getAccessTokenResponse.data.division);
        setStudent_Id(getAccessTokenResponse.data.username)
        console.log(getAccessTokenResponse.data.name, getAccessTokenResponse.data.division, getAccessTokenResponse.data.username);
        
        console.log("Access Token:", getAccessTokenResponse.data.access);
        cookie.save("accessToken", getAccessTokenResponse.data.access, {
          path: "/",
          expires: new Date(getAccessTokenResponse.data.expires),
        });
      } catch (error) {
        console.error("Error checking access token:", error);
      }
    };
  
    // Call fetchData function
    fetchData();
  }, []); // Empty dependency array for the initial render only

  useEffect(() => {
    const fetchDataWrapper = async () => {
      const savedAccessToken = await cookie.load('accessToken');
      const savedRefreshToken = await cookie.load('refreshToken');

      setAccessToken(savedAccessToken);
      setRefreshToken(savedRefreshToken);

      console.log('Access Token from Cookie:', savedAccessToken);
      console.log('Refresh Token from Cookie:', savedRefreshToken);

      // Assuming fetchData is a function that you've defined elsewhere
      // await fetchData(accessAddress, savedAccessToken, savedRefreshToken, setAccessToken, setRefreshToken);
    };

    fetchDataWrapper();
  }, []);

  //-----------------------------------

  const handleCreatePost = async () => {
    try {
      const response = await axios.post(address, {
        student_id: movieContent.student_id,
        title: movieContent.title,
        content: movieContent.content,
      });
      console.log(response.data);

      setIsEditMode(false);
      setEditingPostId(null);
    } catch (error) {
      console.error('게시물 등록 또는 수정 중 오류 발생:', error);
      console.log("여기가 문제여");
      console.log(movieContent);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingPostId(null);
    setMovieContent({
      student_id: 20201738,
      title: '',
      content: '',
    });
  };

  const handleSubmit = () => {
    if (isEditMode) {
      console.log('handleEditPost 함수가 정의되지 않았습니다.');
      // handleEditPost();
    } else {
      handleCreatePost();
    }
  };

  return (
    <>
      <Header />
      <div className='tum'></div>
      <h1 className="Board_title"><span>Lion</span>게시판 글쓰기</h1>
      <div className="write_content">
        <input
          type="text"
          placeholder="제목을 입력하세요."
          value={movieContent.title}
          onChange={handleTitleChange}
        />
        <CKEditor
          editor={ClassicEditor}
          data={movieContent.content}
          onChange={handleContentChange}
        />
        <div className="buttons">
          <button onClick={handleSubmit}>{isEditMode ? '수정 완료' : '작성 완료'}</button>
          {isEditMode && (
            <button onClick={handleCancelEdit}>수정 취소</button>
          )}
        </div>
      </div>
    </>
  );
}

export default Board_Write;