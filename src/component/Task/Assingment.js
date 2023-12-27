import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Assignment = () => {
  const [urlNumber, setUrlNumber] = useState();

  const address = "https://port-0-likelion-12th-backend-9zxht12blqj9n2fu.sel4.cloudtype.app";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${address}/assignment/${urlNumber}/`);

        if (Array.isArray(response.data)) {
          console.log(response.data);
        } else {
          console.log('데이터가 유효하지 않습니다.');
        }
      } catch (error) {
        console.error('Error fetching week list:', error);
        console.log(`${address}/assignment/${urlNumber}`);
      }
    };

    if (urlNumber !== undefined) {
      fetchData();
    }
  }, [urlNumber]);

  useEffect(() => {
    const currentUrl = window.location.href;
    const match = currentUrl.match(/(\d+)\/?$/);

    if (match) {
      const number = parseInt(match[1], 10);
      setUrlNumber(number);
    }
  }, []);
  
  return (
    <>
      <div>과제 제출페이지</div>
      <Link to={`/TaskEdit/${urlNumber}`}>과제 제출하기</Link>
    </>
  );
};

export default Assignment;
