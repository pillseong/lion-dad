import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import cookie from 'react-cookies';

import taskImg from './image 8.png';

import MenuHeader from '../Main/header/MenuHeader';
import LogoHeader from '../Main/header/LogoHeader';
import "./Assing.css"

const Assignment = () => {
  const [urlNumber, setUrlNumber] = useState();
  const navigate = useNavigate();
  const { id } = useParams();
  const [userTaskData, setUserTaskData] = useState([]);
 
  const [assignment, setAssignments] = useState([]);
  const [weekList, setWeekList] = useState([]);
  const [weekCount, setWeekCount] = useState([]);
  const [myWeekList, setMyWeekList] = useState([]);
  const userCount = 2;
  const student_id = 20201816

  const address = "https://port-0-likelion-12th-backend-9zxht12blqj9n2fu.sel4.cloudtype.app";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${address}/week/`, student_id);
        setWeekList(response.data);
        setWeekCount(Math.ceil(response.data.length / userCount));
      } catch (error) {
        console.error('Error fetching week list:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    for (let j = 0; j < weekList.length; j++) {
      for (let k = 0; k < weekList[j].assignment.length; k++) {
        if (weekList[j].assignment[k].student_id == student_id) {
          setMyWeekList(prevList => [...prevList, weekList[j].assignment[k]]);
        }
      }
    }
  }, [weekList]);

  useEffect(() => {
    const fetchData = async () => {
      for (let i = 1; i < (weekCount + 1) / 2; i++) {
        try {
          const response = await axios.get(`${address}/users/${i}/`);
          const { week } = response.data;
          setUserTaskData(week);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchData();
  }, [weekCount]);

  const assignmentdelete = async (assignmentId) => {
    try {
      await axios.delete(`${address}/assignment/${assignmentId}/`, { data: { student_id }});
      navigate(`/Task`);
    } catch (error) {
      console.error('Error deleting assignment:', error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${address}/assignment/${id+1}/`);
        setAssignments(response.data);
      } catch (error) {
        console.error('Error fetching week list:', error);
      }
    };
    if (urlNumber !== undefined) {
      fetchData();
    }
  }, [urlNumber, id]);

  useEffect(() => {
    const currentUrl = window.location.href;
    const match = currentUrl.match(/(\d+)\/?$/);

    if (match) {
      const number = parseInt(match[1], 10);
      setUrlNumber(number);
    }
  }, []);

  const LoginAddress = "http://15.164.190.171/login/";

  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userDivision, setUserDivision] = useState(null);
  const [student_Id, setStudent_Id] = useState(null);

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
  
    fetchData();
  }, []);

  useEffect(() => {
    const fetchDataWrapper = async () => {
      const savedAccessToken = await cookie.load('accessToken');
      const savedRefreshToken = await cookie.load('refreshToken');

      setAccessToken(savedAccessToken);
      setRefreshToken(savedRefreshToken);
    };

    fetchDataWrapper();
  }, []);

  const uniqueItems = myWeekList.filter((item, index, self) =>
    index === self.findIndex(t => (
      t.assignment_title === item.assignment_title && t.file === item.file
    ))
  );
  const bboolean = urlNumber + 1;
  const juyongItems = uniqueItems.filter(item => item.weeks == bboolean);
  console.log(juyongItems);

  return (
    <>
      <MenuHeader />
      <LogoHeader/>
      <div className='assingment__title'></div>
      <div>
        <h1 className='assingment__title__week__header'>{urlNumber + 1} 주차</h1>
        <Link className="assingment__plus__button" to={`/TaskEdit/${urlNumber}`}>+</Link>
        <div className='task__header__line'></div>
        <ul>
          {juyongItems.map((item, index) => (
            <li key={item.assignment_id} className='Assingment__weeks__main__container'>
              <img className="Assingment__img__yo" src={taskImg} alt="Assignment Thumbnail" />
              <div className='Assingment__li__main__container'>
                <p>File: {student_Id}.{item.file.split('/').pop().split('.').pop()}</p>
                <p>{item.submission_time.split("T")[0].replace(/-/g, ".")}</p>
              </div>
              <button className="assingment__del__button" onClick={() => assignmentdelete(item.week_id)}>EDIT</button>
            </li>
          ) )}
        </ul>
      </div>
    </>
  );
};

export default Assignment;
