// src/pages/NotFoundPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css'; // Import CSS để tạo kiểu cho trang

const NotFoundPage = () => {
  const navigate = useNavigate();

  // Hàm quay lại trang chủ
  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <p className="not-found-message">Trang bạn đang tìm kiếm không tồn tại.</p>
        <button className="not-found-button" onClick={goHome}>
          Go back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
