// Introduction.jsx

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import IntroductionEdit from './introductionEdit'; 
import cookie from 'react-cookies';
import './introduction.css';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


import leftButton from '../Board/left.png';
import rightButton from '../Board/right.png';

import HeaderMenu from '../Main/header/MenuHeader';
import HeaderLogo from '../Main/header/LogoHeader';
import Slider from 'react-slick';



function Introduction() {
  const address = "https://port-0-likelion-12th-backend-9zxht12blqj9n2fu.sel4.cloudtype.app/";
  const accessAddress = 
  "http://15.164.190.171/login/";

  const [notices, setNotices] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const student_id = "20201776";

  const navigate = useNavigate();

  const setEditingIdInLocalStorage = (id) => {
    localStorage.setItem('editingId', id);
  };

  
  const [userName, setUserName] = useState(null);
  const [userDivision, setUserDivision] = useState(null);
  const [student_Id, setStudent_Id] = useState(null);
  
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

  const fetchNotices = async () => {
    try {
      const response = await axios.get(`${address}notice/`);
      setNotices(response.data);
    } catch (error) {
      console.error('Error fetching notices:', error);
    }
  };

  const formatNoticeTime = (rawTime) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false };
    return new Date(rawTime).toLocaleDateString('ko-KR', options);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${address}notice/${id}/`, { data: { student_id }});
      fetchNotices();
      navigate('/introduction');
    } catch (error) {
      console.error('Error deleting notice:', error);
    }
  };

  useEffect(() => {
    if (id) {
      const fetchNotice = async () => {
        try {
          const response = await axios.get(`${address}notice/${id}`);
          setTitle(response.data.title);
          setContent(response.data.content);
          setFile(response.data.file || null);
          setEditingId(id);
        } catch (error) {
          console.error('Error fetching notice:', error);
        }
      };
      fetchNotice();
    }
  }, [id]);

  const openModal = async (data) => {
    setModalData(data);
    setIsModalOpen(true);

    if (data.file) {
      try {
        setModalData((prevData) => ({
          ...prevData,
          fileUrl: data.file,
        }));
      } catch (error) {
        console.error('Error fetching file:', error);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  // 상단 슬라이더와 하단 슬라이더에 대한 인스턴스 생성
  const [topSwiper, setTopSwiper] = useState(null);
  const [bottomSwiper, setBottomSwiper] = useState(null);
  const sliderRef = useRef(null);

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

  const introduction_slickSettings = {
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

  const handleWriteButtonClick = () => {
    // 여기서 선택된 게시판 정보를 state로 넘겨줍니다.
    navigate('/introductionWrite');
  };
  

// 나머지 코드는 그대로 둡니다.

  return (
    <div className='parent-div'>
      {/* ... (기존 코드 생략) */}
      <HeaderMenu />
      <HeaderLogo />

      <div className='introduction_main_container'>
        <div className='intro_tum'></div>
        <div className='intro'>
          <div>
            <span className='Lion'>Lion </span>
            <span className='title'>공지사항</span>
          </div>
          <button onClick={handleWriteButtonClick} className='introduction__write__button'>+</button>
        </div>
        <div className='intro_line'></div>
        <div className="swiper-container">
        <div className="slider_button_container__2">
              <button onClick={handleSliderPrev}><img className="slider__left__button__2" src={leftButton} alt="Left Button" /></button>
              <button onClick={handleSliderNext}><img className="slider__right__button__2" src={rightButton} alt="Right Button" /></button>
            </div>
          <div className="swiper-e">
            {/* 상단 슬라이더 */}
            <Slider {...introduction_slickSettings} ref={sliderRef}>
            {notices.map((notice, index) => (
              <div key={notice.id} className='main_introduction' onClick={() => openModal(notice)}>
                <div className='sub_introduction'>
                    <span className='introduction__id'>{notice.id}</span>
                    <span className='introduction__title'>{notice.notice_title}</span>
                    <span className='introduction__time'>{formatNoticeTime(notice.notice_time)}</span>
                </div>
                <div className='gimojji'>
                  <div className='introduction__side__button'>
                      {/* <Link className='board__admin__del__button'
                          to={`/edit-notice/${notice.id}`}
                          onClick={() => handleDelete(notice.id)}
                      >
                          ❌
                      </Link > */}
                      <button className='board__admin__del__button__yo'
                          onClick={() => handleDelete(notice.id)}
                      >
                          ❌
                      </button >
                  </div>
                </div>
            </div>
              ))}
            </Slider>
          </div>
        </div>



        {isModalOpen && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ width: '51%', height: '75%' , background: '#282828'}}>
              <h3 className='introduction__modal__title'>{modalData.notice_title}</h3>
              <span className='introduction__modal__time'>작성일자 : {formatNoticeTime(modalData.notice_time)}</span>
              <div className='introduction__modal__header__line'></div>
              {modalData.fileUrl && (
                <div className='introduction__modal__img'>
                  {modalData.fileUrl.endsWith('.pdf') ? (
                    <embed src={modalData.fileUrl} type="application/pdf" width="600" height="400" />
                  ) : (
                    <img src={modalData.fileUrl} alt="File" style={{ maxWidth: '100%', maxHeight: '400px' }} />
                  )}
                </div>
              )}
              <p className='introduction__modal__content'>{modalData.notice_comment}</p>
                <button onClick={closeModal} className='introduction__modal__close__button'>닫기</button>
              {/* <button>수정하기</button> */}
            </div>
          </div>
        )}
        {editingId && <IntroductionEdit />}
      </div>
    </div>
  );
}

export default Introduction;