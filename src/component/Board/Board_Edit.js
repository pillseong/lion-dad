// Board_Edit.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import cookie from "react-cookies";


function Board_Edit() {
  const { id } = useParams();
  const [editedPost, setEditedPost] = useState({ title: '', content: '' });

  const navigate = useNavigate();

  const student_id = 20201776;

  const address = "http://13.124.78.53/qna/questions";

  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  
  const LoginAddress = "http://15.164.190.171/login/";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedAccessToken = cookie.load("accessToken");
        const savedRefreshToken = cookie.load("refreshToken");
        setRefreshToken(savedRefreshToken);
        setAccessToken(savedAccessToken);
    
        const getAccessTokenResponse = await axios.post(
          `${LoginAddress}`,
          {
            access: savedAccessToken,
            refresh: savedRefreshToken,
          }
        );
  
        setUserName(getAccessTokenResponse.data.name);
        setUserDivision(getAccessTokenResponse.data.division);
        setStudent_Id(getAccessTokenResponse.data.username)
        
        
        cookie.save("accessToken", getAccessTokenResponse.data.access, {
          path: "/",
          expires: new Date(getAccessTokenResponse.data.expires),
        });
      } catch (error) {
        console.error("Error checking access token:", error);
        console.log("ddd");
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


      // Assuming fetchData is a function that you've defined elsewhere
      // await fetchData(accessAddress, savedAccessToken, savedRefreshToken, setAccessToken, setRefreshToken);
    };

    fetchDataWrapper();
  }, []);



  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(`${address}/${id}/`);
        const postDetails = response.data;
        console.log(postDetails);
        setEditedPost({ title: postDetails.title, content: postDetails.content });
      } catch (error) {
        console.error('게시물 상세 정보를 불러오는 중 오류 발생:', error);
      }
    };
    fetchPostDetails();
  }, [id]);

  const handleTitleChange = (e) => {
    setEditedPost({ ...editedPost, title: e.target.value, student_id });
  };

  const handleContentChange = (e) => {
    setEditedPost({ ...editedPost, content: e.target.value, student_id });
  };

  const saveChanges = async () => {
    try {
      const formData = new FormData();
      // 학번 title, content
      formData.append('title', editedPost.title);
      formData.append('content', editedPost.content);
      formData.append('student_id', student_id);

      await axios.put(`${address}/${id}/`, formData);
      console.log('게시물이 성공적으로 수정되었습니다.');
      navigate('/Board');
    } catch (error) {
      console.error('게시물 수정 중 오류 발생:', error);
    }
  };

  return (
    <div>
      <h1>Edit Post</h1>
      <label>Title: </label>
      <input type="text" value={editedPost.title} onChange={handleTitleChange} />
      <br />
      <label>Content: </label>
      <textarea value={editedPost.content} onChange={handleContentChange} />
      <br />
      <button onClick={saveChanges}>Save Changes</button>
    </div>
  );
}

export default Board_Edit;