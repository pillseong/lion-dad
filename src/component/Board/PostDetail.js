// PostDetail.js
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Main/header/header';
import './PostDetail.css'; 
import boardData from '../../Board.json';

function PostDetail() {
  const { postId } = useParams();
  const post = boardData.free[postId]; // 여기서 'free'는 게시판 타입에 따라 수정하세요.

  return (
    <>
      <Header />
      <div className='tum'></div>
      <h1 className="PostDetail_title">포스트 상세 내용</h1>
      <div className="PostDetail_content">
        {post && (
          <>
            <h2>{post.title}</h2>
            <p>{post.write}</p>
            {/* 댓글 등 추가 내용을 표시하는 부분을 추가할 수 있습니다. */}
          </>
        )}
      </div>
    </>
  );
}

export default PostDetail;