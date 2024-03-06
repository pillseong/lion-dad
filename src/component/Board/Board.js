import React, { useState, useEffect, useRef  } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Board/Board.css';
import cookie from "react-cookies";

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import LogoHeader from '../Main/header/LogoHeader';
import MenuHeader from "../Main/header/MenuHeader";

import leftButton from '../Board/left.png';
import rightButton from '../Board/right.png';


function Board() {

  const sliderRef = useRef(null);
  let studentId = parseInt('20201111', 10);
  let [jjinStudentId, setJjinStudentId] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState('qna');
  const [selectedPost, setSelectedPost] = useState(null);
  const [comment, setComment] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [board, setBoard] = useState([]);
  const [postDetails, setPostDetails] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedPost, setEditedPost] = useState({ title: '', content: '' });

  const [answers, setAnswers] = useState([]);
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [address, setAddress] = useState('http://13.124.78.53/qna/questions');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const response = await axios.get(`${address}/?student_id=${showMyPosts ? student_Id : ''}&ordering=-id`);
        setBoard(response.data);
      } catch (error) {
        console.error('게시판 데이터를 불러오는 중 오류 발생:', error);
      }
    };
    fetchBoardData();
  }, [showMyPosts, address, studentId]);

  //----------------------------------------

  const [userName, setUserName] = useState(null);
  const [userDivision, setUserDivision] = useState(null);
  const [student_Id, setStudent_Id] = useState(null);
  studentId = parseInt(student_Id, 10)
  setJjinStudentId = studentId;
  
  const LoginAddress = 
  // "https://port-0-djangoproject-umnqdut2blqqevwyb.sel4.cloudtype.app/login/";
  "http://15.164.190.171/login/";

  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

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
        studentId = getAccessTokenResponse.data.username;
        
        
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


      // Assuming fetchData is a function that you've defined elsewhere
      // await fetchData(accessAddress, savedAccessToken, savedRefreshToken, setAccessToken, setRefreshToken);
    };

    fetchDataWrapper();
  }, []);
  //----------------------------------------

  const setBoardType = (type) => {
    setSelectedBoard(type);
  };

  const handleBoardTypeChange = (type) => {
    setBoardType(type);
    setAddress(`http://13.124.78.53/${type}/questions`);
  };

  const handleMyPostsCheckboxChange = () => {
    setShowMyPosts(!showMyPosts);
  };

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const response = await axios.get(`${address}/`);
        setBoard(response.data);
      } catch (error) {
        console.error('게시판 데이터를 불러오는 중 오류 발생:', error);
      }
    };
    fetchBoardData();
  }, [address]);

  const fetchPostDetails = async (postId) => {
    try {
      const response = await axios.get(`${address}/${postId}/`);
      setPostDetails(response.data);

      const answerResponse = await axios.get(`${address}/${postId}/answers/`);
      setAnswers(answerResponse.data);
    } catch (error) {
      console.error('게시물 상세 정보를 불러오는 중 오류 발생:', error);
    }
  };

  const handlePostClick = async (postId) => {
    setAnswers([]); // 답변 목록 초기화
    if (board && board.find((post) => post.id === postId)) {
      setAnswers([]);
      setSelectedPost(postId);
      setIsModalOpen(true);
      setIsEditMode(false);
      fetchPostDetails(postId);
    } else {
      setSelectedPost(null);
      setIsModalOpen(false);
      setPostDetails(null);
      setAnswers([]);
    }
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const addAnswer = async () => {
    fetchPostDetails
    if (selectedPost && comment.trim() !== '') {
      try {
        await axios.post(`${address}/${selectedPost}/answers/`, {
          student_id: studentId,
          content: comment,
        });
        const response = await axios.get(`${address}/${selectedPost}/answers/`);
        const getanswerdata = response.data;

        setAnswers(getanswerdata);

        setIsModalOpen(true);
      } catch (error) {
        console.error('댓글 추가 중 오류 발생:', error);
      }
    }
  };

  const deleteAnswer = async (answerId) => {
    try {
      await axios.delete(`${address}/${selectedPost}/answers/${answerId}/?student_id=${studentId}`);
      const updatedAnswers = answers.filter((answer) => answer.id !== answerId);
      setAnswers(updatedAnswers);
    } catch (error) {
      console.error('댓글 삭제 중 오류 발생:', error);
    }
  };

  const editComment = async () => {
    try {
      const commentToUpdate = answers.find((comment) => comment.id === selectedCommentId);

      await axios.put(`${address}/${selectedPost}/answers/${selectedCommentId}/`, {
        student_id: studentId,
        content: comment,
      });

      const updatedAnswerResponse = await axios.get(`${address}/${selectedPost}/answers/`);
      setAnswers(updatedAnswerResponse.data);
      const updatedComment = updatedAnswerResponse.data.find((comment) => comment.id === selectedCommentId);
      if (updatedComment) {
        setComment(updatedComment.content);
      }
    } catch (error) {
      console.error('댓글 수정 중 오류 발생:', error);
    }
  };

  const editevent = async (commentId) => {
    try {
      const commentToUpdate = answers.find((comment) => comment.id === commentId);
      setComment(commentToUpdate.content);
      setSelectedCommentId(commentId);

      setIsModalOpen(true);
    } catch (error) {
      console.error('댓글 수정 중 오류 발생:', error);
    }
  };

  const deletePost = async () => {
    try {
      await axios.delete(`${address}/${selectedPost}/?student_id=20201738`);
      const updatedBoard = board.filter((post) => post.id !== selectedPost);
      setBoard(updatedBoard);
      setIsModalOpen(false);
      setPostDetails(null);
    } catch (error) {
      console.error('게시물 삭제 중 오류 발생:', error);
      setIsModalOpen(false);
    }
  };

  const handleEditClick = (event) => {
    event.stopPropagation(); // 이벤트 전파 방지
    if (postDetails) {
      setIsEditMode(true);
      setEditedPost({
        title: postDetails.title || '',
        content: postDetails.content || '',
      });
      setIsModalOpen(true);
    }
  };

  const navigateToEditPage = (postId) => {
    navigate(`/boardEdit/${postId}`);
  };

  const editPost = async (post) => {
    try {
      await axios.put(`${address}/${selectedPost}/answers/`, post);
      const response = await axios.get(`${address}/${selectedPost}/`);
      const updatedPost = response.data;

      setPostDetails(updatedPost);

      const boardResponse = await axios.get(`${address}/`);
      const updatedBoard = boardResponse.data;

      setBoard(updatedBoard);

      setIsModalOpen(false);

      navigateToEditPage(selectedPost);
    } catch (error) {
      console.error('게시물 수정 중 오류 발생:', error);
      setIsModalOpen(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPostDetails(null);
    setIsEditMode(false);
  };

  const handleWriteButtonClick = () => {
    // 여기서 선택된 게시판 정보를 state로 넘겨줍니다.
    navigate('/boardWrite', { state: { selectedBoard } });
  };

  //---------------스와이퍼부분
  const formatNoticeTime = (rawTime) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false };
    return new Date(rawTime).toLocaleDateString('ko-KR', options);
  };

  

  // 상단 슬라이더와 하단 슬라이더에 대한 인스턴스 생성

  const handleSliderPrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const handleSliderNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const slickSettings = {
    dots: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    slidesPerRow: 4, 
    arrows: false, 
    infinite: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  //---------------스와이퍼부분

  const qnaButtonRef = useRef(null);
  const freeButtonRef = useRef(null);

  useEffect(() => {
    // 컴포넌트가 마운트된 후에 참조가 올바르게 설정될 것입니다.
    qnaButtonRef.current = document.getElementById('qnaButton');
    freeButtonRef.current = document.getElementById('freeButton');
  }, []);

  const handleButtonClick = (buttonRef) => {
    // 버튼 참조가 유효한지 확인
    if (buttonRef.current) {
      // 버튼 클릭 시 해당 버튼에 .moved 클래스 추가
      buttonRef.current.classList.add('moved');
  
      // 다른 버튼에는 .moved 클래스 제거
      const otherButtonRef = buttonRef === qnaButtonRef ? freeButtonRef : qnaButtonRef;
      if (otherButtonRef.current) {
        otherButtonRef.current.classList.remove('moved');
      }
  
      // 자유게시판 버튼을 클릭했을 때
      if (buttonRef === freeButtonRef) {
        handleBoardTypeChange('free'); // 여기에 추가: 선택한 버튼에 따라 게시판 타입을 변경
      } else {
        handleBoardTypeChange('qna'); // QnA게시판 버튼 클릭 시에는 'qna'로 변경
      }
    }
  };
  

  return (
    <>
   
 
        <MenuHeader />
        <LogoHeader className="LogoHeader" />
      
      
      <div className='tum'></div>
      <div className='choice_button'>
        <div className='Board_main_header_container'>
          <span className='Board_Lion_title'>Lion</span>
          <div className="Board_buttons">
          <button className="board__qna__button" id="qnaButton" onClick={() => handleButtonClick(qnaButtonRef)}>QnA게시판</button>
            <button className="board__free__button" id="freeButton" onClick={() =>  handleButtonClick(freeButtonRef)}>자유게시판</button>
          </div>
        </div>
        <button onClick={handleWriteButtonClick} className='write_button'>+</button>
      </div>
      <hr className='board_line'/>
      <div className="Board_content">
        {board.length > 0 && (
          <>
            <div className="slider_button_container">
              <button onClick={handleSliderPrev}><img className="slider__left__button" src={leftButton} alt="Left Button" /></button>
              <button onClick={handleSliderNext}><img src={rightButton} alt="Right Button" /></button>
            </div>
            <div className="Board_table">
              <Slider {...slickSettings} ref={sliderRef}>
                {board.length > 1 && board[0].id > board[1].id ?
                  board.map((post, index) => (
                    <div key={post.id} className='board_swiper_main_container'>
                      <div className="board_swiper_container" onClick={() => handlePostClick(post.id)}>
                        <div className='board_swiper_left'>
                          <div className='board_swiper_left_id'>{post.id}</div>
                          <div className='board_swiper_left_title'>{post.title}</div>
                        </div>
                        <div className='board__write__name'>
                          {userDivision == "admin" || userDivision == "front admin" || userDivision == "back admin" || userDivision == "design admin" ? <div className='author_name'>{post.author.name}</div> : ''}
                          <div className='board__write__time'>
                            {formatNoticeTime(post.created_at)}
                          </div>
                        </div>
                        <div className='gimojji'>
                          <div className='board__del__edit__button'>
                            {userDivision == "admin" || userDivision == "front admin" || userDivision == "back admin" || userDivision == "design admin" || post.author.student_id === student_Id ? (
                              <button className="board__admin__del__button" onClick={(event) => deletePost(event)}>
                                ❌
                              </button>
                            ) : (
                              null
                            )}
                          </div>
                          <div>
                            {userDivision == "admin" || userDivision == "front admin" || userDivision == "back admin" || userDivision == "design admin" || post.author.student_id === student_Id ? (
                              <button className="board__admin__edit__button" onClick={() => editPost(post.id)}>
                                🔨
                              </button>
                            ) : (
                              null
                            )}
                          </div>
                        </div>
                      </div>
                      {/* 원 나갔지롱 */}
                    </div>
                  )) : 
                  board.reverse().map((post, index) => (
                    <div key={post.id} className='board_swiper_main_container'>
                      <div className="board_swiper_container" onClick={() => handlePostClick(post.id)}>
                        <div className='board_swiper_left'>
                          <div className='board_swiper_left_id'>{post.id}</div>
                          <div className='board_swiper_left_title'>{post.title}{post.content}</div>
                        </div>
                        <div className='board__write__name'>
                          {userDivision == "admin" || userDivision == "front admin" || userDivision == "back admin" || userDivision == "design admin" ? post.author.name : '알 수 없는 작성자'}
                          <div className='board__write__time'>
                            {post.created_at.split('T')[0]}
                            {userDivision}
                          </div>
                        </div>
                        <div>
                          <div className='board__del__edit__button'>
                            {userDivision == "admin" || userDivision == "front admin" || userDivision == "back admin" || userDivision == "design admin" ? (
                              <button className="board__admin__del__button" onClick={(event) => deletePost(event)}>
                                ❌
                              </button>
                            ) : (
                              null
                            )}
                          </div>
                          <div>
                            {userDivision == "admin" || userDivision == "front admin" || userDivision == "back admin" || userDivision == "design admin" || post.author.student_id === student_Id ? (
                              <button className="board__admin__edit__button" onClick={() => editPost(post.id)}>
                                🔨
                              </button>
                            ) : (
                              null
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </Slider>
            </div>

            {selectedPost && board.find((post) => post.id === selectedPost) && isModalOpen && (
              <div className='board__modal__main__container'>
                <div className="overlay" onClick={closeModal}></div>
                <div className={`modal ${postDetails && postDetails.answers.length > 3 ? 'with-scroll' : ''}`} style={{ width: '51%', height: '75%' , background: '#282828'}}>
                  <div className='modal__header__title'>
                    <h3 className='modal__title'>{`${postDetails ? postDetails.title : '불러오는 중...'}`}</h3>
                    <div className='modal__creat__time'>
                      <span>{`작성일자 :  ${postDetails ? postDetails.created_at.split('T')[0] : '불러오는 중...'}`}</span>
                      <span>{` (${postDetails ? postDetails.created_at.split('T')[1].split(':')[0] : '불러오는 중...'}`}</span>
                      <span>{` : ${postDetails ? postDetails.created_at.split('T')[1].split(':')[1] : '불러오는 중...'} )`}</span>
                    </div>
                  </div>
                  <div className='modal__day__line'></div>
                  {!isEditMode ? (
                    <>
                      <div>{` ${postDetails ? postDetails.content : '불러오는 중...'}`}</div>
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        placeholder="제목"
                        value={editedPost.title}
                        onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
                      />
                      <textarea
                        placeholder="내용"
                        value={editedPost.content}
                        onChange={(e) => setEditedPost({ ...editedPost, content: e.target.value })}
                      />
                    </>
                  )}
                  <div>
                    <h3 className='modal__answer__main'>댓글</h3>
                    <div className='modal__answer__liner'></div>
                      {postDetails  && 
                        postDetails.answers.map((answer) => (
                        <>
                        <span className='madal__userInfo'>{answer.id}</span>
                        <li key={answer.id} className='modal__answer__answer_main'>
                          <span className='modal__answer__answer'>{answer.content}</span>
                          <div>
                            <button className="modal__answer__edit" onClick={() => editevent(answer.id)}>수정</button>
                            
                            <button className="modal__answer__del" onClick={() => deleteAnswer(answer.id)}>-</button>
                          </div>
                        </li>
                        </>
                      ))}
                    </div>
                    <button className="modal__close-button" onClick={closeModal}>X</button>
                  </div>
              </div>
            )}
              {isModalOpen && (
              <div className='modal__answer__container_2'>
                <div className='modal__answer__input__container_2'>
                  <span className='modal__answer__input__main'>댓글 작성</span>
                  <textarea
                    placeholder="댓글을 입력하세요"
                    value={comment}
                    onChange={handleCommentChange}
                    className='modal__answer__input'
                  />
                </div>
                <div className='modal__plusAndChange_2'>
                  <button className="modal__add__button" onClick={addAnswer}>ADD</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Board;