// Board.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Main/header/header';
import './Board.css';
// import { useAuth } from '../Login/AuthContext';

import boardData from '../../Board.json';

function Board() {
  // const { loginInfo } = useAuth();

  const [selectedBoard, setSelectedBoard] = useState('free');
  const [selectedPost, setSelectedPost] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getBoardData = () => {
    return boardData[selectedBoard];
  };

  const currentBoardData = getBoardData();

  const handlePostClick = (postId) => {
    if (currentBoardData && currentBoardData[postId]) {
      setSelectedPost(postId);
      setIsModalOpen(true);
    } else {
      setSelectedPost(null);
      setIsModalOpen(false);
    }
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const addComment = () => {
    if (selectedPost && comment.trim() !== '') {
      setComments([...comments, { postId: selectedPost, content: comment }]);
      setComment('');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setComment('');
    setComments([]);
  }, [selectedPost]);

  return (
    <>
      <Header />
      <div className='tum'></div>
      <h1 className="Board_title">여긴 게시판 페이지</h1>
      <div className='choice_button'>
        <div className="Board_buttons">
            <button onClick={() => setSelectedBoard('free')}>자유게시판</button>
            <button onClick={() => setSelectedBoard('QnA')}>QnA게시판</button>
        </div>
            <Link to="/boardWrite" className='write_button'>글 작성</Link>
      </div>
      <div className="Board_content">
        {currentBoardData && (
          <>
            <h2>{`${selectedBoard} 게시판`}</h2>
            <table className="Board_table">
              <thead>
                <tr className='ttl'>
                  <th>ID</th>
                  <th>이름</th>
                  <th>제목</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(currentBoardData).map((postId) => (
                  <tr key={postId} onClick={() => handlePostClick(postId)}>
                    <td>{postId}</td>
                    <td>{currentBoardData[postId].name}</td>
                    <td>{currentBoardData[postId].title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {selectedPost && currentBoardData[selectedPost] && isModalOpen && (
              <>
                <div className="overlay" onClick={closeModal}></div>
                <div className="modal">
                  <h3>{`게시물 ID: ${selectedPost}`}</h3>
                  <div>{`게시물 제목: ${currentBoardData[selectedPost].title}`}</div>
                  <div>{`게시물 내용: ${currentBoardData[selectedPost].write}`}</div>
                  <div>
                    <h3>댓글</h3>
                    <ul>
                      {comments
                        .filter((c) => c.postId === selectedPost)
                        .map((c, index) => (
                          <li key={index}>{c.content}</li>
                        ))}
                    </ul>
                    <textarea
                      placeholder="댓글을 입력하세요"
                      value={comment}
                      onChange={handleCommentChange}
                    />
                    <button onClick={addComment}>댓글 작성</button>
                  </div>
                  <button onClick={closeModal}>닫기</button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Board;
