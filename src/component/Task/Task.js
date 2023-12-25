import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../Main/header/header';
import './Task.css'
import { useAuth } from '../Login/AuthContext';

const Task = () => {
  const { loginInfo, setLoginInfo } = useAuth();

  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [weekList, setWeekList] = useState([]);
  const [userAssignments, setUserAssignments] = useState([]); // 사용자 과제 목록 추가

  const address = "https://port-0-likelion-12th-backend-9zxht12blqj9n2fu.sel4.cloudtype.app/week/"

  useEffect(() => {
    // 과제 목록 조회
    axios.get(`${address}`)
      .then(response => {
        setAssignments(response.data);
      })
      .catch(error => {
        console.error('Error fetching assignments:', error);
      });

    // 주차 리스트 조회
    axios.get(`${address}`)
      .then(response => {
        setWeekList(response.data);
      })
      .catch(error => {
        console.error('Error fetching week list:', error);
      });

    // 여기에서 로그인 정보를 확인하고, 운영자 여부를 설정
    // 예: 로그인 정보에서 role이 'admin'인 경우 setIsAdmin(true)로 설정
    const loggedInUserRole = 'admin'; // 임시 값, 실제로는 로그인 정보에서 가져와야 함
    setIsAdmin(loggedInUserRole === 'admin');
  }, []);

  useEffect(() => {
    // 선택된 주차에 해당하는 사용자 과제 목록 조회
    if (selectedAssignment) {
      axios.get(`${address}/${selectedAssignment.id}/user-assignments/`)
        .then(response => {
          setUserAssignments(response.data);
        })
        .catch(error => {
          console.error('Error fetching user assignments:', error);
        });
    }
  }, [selectedAssignment]);

  const handleAssignmentClick = (assignmentId) => {
    // 과제 세부조회
    axios.get(`${address}/${assignmentId}`)
      .then(response => {
        setSelectedAssignment(response.data);
      })
      .catch(error => {
        console.error('Error fetching assignment details:', error);
      });
  };

  const handleCreateAssignment = () => {
    // 운영자인 경우에만 과제 생성 가능
    if (!isAdmin) {
      console.error('Permission denied. Only admins can create assignments.');
      return;
    }

    // 새로운 과제 생성
    const newAssignmentData = {
      // 여기에 새로운 과제의 데이터를 추가하세요.
      // 예: title, description 등
    };

    axios.post(`${address}`, newAssignmentData)
      .then(response => {
        // 생성된 과제를 assignments에 추가하거나, 필요한 동작을 수행하세요.
        console.log('Assignment created:', response.data);
        // 생성된 과제 목록 다시 불러오기
        axios.get(`${address}`)
          .then(response => {
            setAssignments(response.data);
          })
          .catch(error => {
            console.error('Error fetching assignments:', error);
          });
      })
      .catch(error => {
        console.error('Error creating assignment:', error);
      });
  };

  const handleUpdateAssignment = () => {
    // 수정된 데이터 + 넘겨받은 데이터를 모두 해당 주소로 보냄
    const updatedAssignmentData = {
      // 여기에 수정된 과제의 데이터를 추가하세요.
      // 예: title, description 등
    };

    axios.put(`${address}/${selectedAssignment.id}/`, updatedAssignmentData)
      .then(response => {
        // 수정된 과제를 업데이트하거나, 필요한 동작을 수행하세요.
        console.log('Assignment updated:', response.data);
      })
      .catch(error => {
        console.error('Error updating assignment:', error);
      });
  };

  const handleDeleteAssignment = () => {
    // 운영자인 경우에만 과제 삭제 가능
    if (!isAdmin) {
      console.error('Permission denied. Only admins can delete assignments.');
      return;
    }

    // 과제 삭제
    axios.delete(`${address}/${selectedAssignment.id}/`)
      .then(response => {
        // 삭제된 과제를 처리하거나, 필요한 동작을 수행하세요.
        console.log('Assignment deleted:', response.data);
        // 삭제된 과제 목록 다시 불러오기
        axios.get(`${address}`)
          .then(response => {
            setAssignments(response.data);
          })
          .catch(error => {
            console.error('Error fetching assignments:', error);
          });
      })
      .catch(error => {
        console.error('Error deleting assignment:', error);
      });
  };

  return (
    <>
        <Header />
        <div className='task_main_container'>
        <h1>과제 목록</h1>
        <ul>
            {assignments.map(assignment => (
            <li key={assignment.id} onClick={() => handleAssignmentClick(assignment.id)}>
                {assignment.title}
            </li>
            ))}
        </ul>

        {selectedAssignment && (
            <div>
            <h2>선택한 과제: {selectedAssignment.title}</h2>
            {/* 여기에 과제 세부조회 정보를 표시하세요. */}
            <ul>
                {userAssignments.map((userAssignment, index) => (
                <li key={index}>{`${index + 1}주차 과제: ${userAssignment.title}`}</li>
                ))}
            </ul>
            <button onClick={handleUpdateAssignment}>과제 수정</button>
            <button onClick={handleDeleteAssignment}>과제 삭제</button>
            </div>
        )}

        {/* 운영자인 경우에만 보이는 과제 생성 칸 */}
        {isAdmin && (
            <div>
            <h2>과제 생성</h2>
            <form>
                {/* 과제 생성 폼 */}
            </form>
            <button onClick={handleCreateAssignment}>새로운 과제 생성</button>
            </div>
        )}
        </div>
    </>
  );
};

export default Task;
