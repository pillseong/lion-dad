// board_test.js

import React, { useState, useEffect } from 'react';
import './board_test.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Header from '../Main/header/header';

function Board_test() {
    // 상태 변수 초기화
    const [movieContent, setMoviecontent] = useState({
        title: '',
        content: ''
    });

    const [viewContent, setViewContent] = useState([]);
    const [editor, setEditor] = useState(null);

    // 입력 폼 값 변경 시 호출되는 함수
    const getValue = (e) => {
        const { name, value } = e.target;
        setMoviecontent((prevContent) => ({
            ...prevContent,
            [name]: value
        }));
    };

    // movieContent 상태가 업데이트 될 때 로그 출력
    useEffect(() => {
        console.log('Movie Content:', movieContent);
    }, [movieContent]);

    // viewContent 상태가 업데이트 될 때 로그 출력
    useEffect(() => {
        console.log('View Content:', viewContent);
    }, [viewContent]);

    // 폼 초기화 함수
    const clearForm = () => {
        if (editor) {
            // CKEditor 데이터 초기화
            editor.setData('');
        }
        
        // 제목 및 내용 초기화
        setMoviecontent({ title: '', content: '' });
    };

    return (
        <>
            <Header />
            <div className="App">
                <div className='eyes'>
                    <h1>자유 게시판 초안 (테스트) </h1>
                    <div className="movie-container">
                        {/* viewContent를 매핑하여 게시물 출력 */}
                        {viewContent.map((element, index) => (
                            <div key={index}>
                                <h2>{element.title}</h2>
                                <div>{element.content}</div>
                                <hr/>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="form-wrapper">
                    {/* 제목 입력란 */}
                    <input
                        className="title-input"
                        type="text"
                        placeholder="제목"
                        onChange={getValue}
                        name="title"
                        value={movieContent.title}  // value 속성 추가
                    />
                    {/* CKEditor를 사용한 내용 입력 */}
                    <CKEditor
                        editor={ClassicEditor}
                        data={movieContent.content}
                        onReady={(editor) => {
                            console.log('Editor is ready to use!', editor);
                            setEditor(editor);
                        }}
                        onChange={(event, editor) => {
                            // CKEditor 데이터 변경 시 호출되는 함수
                            const data = editor.getData();
                            setMoviecontent((prevContent) => ({
                                ...prevContent,
                                content: data
                            }));
                        }}
                        onBlur={(event, editor) => {
                            console.log('Blur.', editor);
                        }}
                        onFocus={(event, editor) => {
                            console.log('Focus.', editor);
                        }}
                    />
                </div>
                {/* 게시물 등록 버튼 */}
                <button
                    className="submit-button"
                    onClick={() => {
                        // viewContent 상태 업데이트
                        setViewContent((prevContent) => [...prevContent, { ...movieContent }]);
                        // 입력 폼 초기화 함수 호출
                        clearForm();
                    }}
                >
                    입력
                </button>
            </div>
        </>
    );
}

export default Board_test;