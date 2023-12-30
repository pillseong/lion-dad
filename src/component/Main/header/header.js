import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './header.css';


function Header() {
  const location = useLocation();

  const isLinkActive = (path) => {
    //현재 링크 표시
    return location.pathname === path;
  };

  return (
    <div className='header_main_container'>
      <h2 className='header_menubar'>Quick Menu</h2>
      <div className="header">
        <Link to="/" className={isLinkActive('/') ? 'active' : ''}>
          홈
        </Link>
        <Link to="/Board" className={isLinkActive('/Board') ? 'active' : ''}>
          게시판
        </Link>
        <Link
          to="/Introduction"
          className={isLinkActive('/Introduction') ? 'active' : ''}
        >
          공지사항
        </Link>
        <Link to="/Login" className={isLinkActive('/Login') ? 'active' : ''}>
          로그인
        </Link>
        <Link to="/info" className={isLinkActive('/info') ? 'active' : ''}>
          내정보
        </Link>
        <Link to="/Notice" className={isLinkActive('/Notice') ? 'active' : ''}>
          소개
        </Link>
        <Link to="/Task" className={isLinkActive('/Task') ? 'active' : ''}>
          과제함
        </Link>
      </div>
    </div>
  );
}

export default Header;