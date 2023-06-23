import React, { useState, useEffect } from 'react';
import './css/style.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [memo, setMemo] = useState('');
  const [memos, setMemos] = useState({});

    // 로컬 스토리지에서 메모 데이터 불러오기
  useEffect(() => {
    const storedMemos = localStorage.getItem('memos');
    if (storedMemos) {
      setMemos(JSON.parse(storedMemos));
    }
  }, []);

  // 메모 데이터 저장하기
  useEffect(() => {
    localStorage.setItem('memos', JSON.stringify(memos));
  }, [memos]);

  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const handleDateClick = (date) => {
    setSelectedDate((prevSelectedDate) => (prevSelectedDate === date ? null : date));
  };

  const handleMemoChange = (e) => {
    setMemo(e.target.value);
  };

  const handleSaveMemo = () => {
    setMemos((prevMemos) => ({
      ...prevMemos,
      [selectedDate]: memo,
    }));
    setMemo('');
  };

  const handleEditMemo = () => {
    setMemo(memos[selectedDate]);
  };

  const handleDeleteMemo = () => {
    setMemos((prevMemos) => {
      const updatedMemos = { ...prevMemos };
      delete updatedMemos[selectedDate];
      return updatedMemos;
    });
    setSelectedDate(null);
    setMemo('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDay.getDate();
    const startDate = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate() - firstDay.getDay());
    const endDate = new Date(lastDay.getFullYear(), lastDay.getMonth(), lastDay.getDate() + (6 - lastDay.getDay()));

    const calendar = [];
    let dateIterator = startDate;

    while (dateIterator <= endDate) {
      const formattedDate = dateIterator.toISOString().slice(0, 10);
      const isSunday = dateIterator.getDay() === 0;
      const isSaturday = dateIterator.getDay() === 6;
      calendar.push(
        <div
          key={formattedDate}
          className={`calendar-date ${dateIterator.getMonth() !== month ? 'other-month' : ''} ${selectedDate === formattedDate ? 'selected' : ''} ${memos[formattedDate] ? 'has-memo' : ''} ${isSunday ? 'sun' : ''} ${isSaturday ? 'sat' : ''}`}
          onClick={() => handleDateClick(formattedDate)}
        >
          <span>{dateIterator.getDate()}</span>
          {memos[formattedDate] && <div className="memo-dot" />}
        </div>
      );

      dateIterator.setDate(dateIterator.getDate() + 1);
    }

    return calendar;
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={handlePreviousMonth}>{'<'}</button>
        <h2>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
        <button onClick={handleNextMonth}>{'>'}</button>
      </div>
      <div className="calendar-body">
        <div className="calendar-grid">
          <div className="calendar-date common-date sun"><span>일</span></div>
          <div className="calendar-date common-date mon"><span>월</span></div>
          <div className="calendar-date common-date tue"><span>화</span></div>
          <div className="calendar-date common-date wed"><span>수</span></div>
          <div className="calendar-date common-date thu"><span>목</span></div>
          <div className="calendar-date common-date fri"><span>금</span></div>
          <div className="calendar-date common-date sat"><span>토</span></div>
          {renderCalendar()}
        </div>
      </div>
      {selectedDate && memos[selectedDate] && (
        <div className="memo-viewer">
          <h2>{memos[selectedDate]}</h2>
          <button className='edit-btn' onClick={handleEditMemo}>수정</button>
          <button className='delete-btn' onClick={handleDeleteMemo}>삭제</button>
        </div>
      )}
      {selectedDate && (
        <div className="memo-title">
          <span>{formatDate(selectedDate)} 메모</span>
          <div className="memo-editor">
            <textarea type='text' value={memo} autoFocus onChange={handleMemoChange} placeholder="메모를 입력하세요" />
            <button className='save-btn' onClick={handleSaveMemo}>저장</button>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default Calendar;
