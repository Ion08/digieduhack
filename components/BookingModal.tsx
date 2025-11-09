import React, { useState, useEffect } from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Icon } from './common/Icon';
import { Chapter, Teacher } from '../types';
import { Spinner } from './common/Spinner';

interface BookingModalProps {
  teacher: Teacher;
  chapters: Chapter[];
  onClose: () => void;
}

const MOCK_AVAILABLE_DATES_IN_MONTH = [10, 11, 12, 13, 14, 17, 18, 19, 20, 21, 24, 25, 26, 27, 28];
const MOCK_AVAILABLE_TIMES = ["4:00pm", "4:30pm", "5:00pm", "5:30pm", "6:00pm", "6:30pm", "7:00pm", "7:30pm", "8:00pm"];


export const BookingModal: React.FC<BookingModalProps> = ({ teacher, chapters, onClose }) => {
  const [bookingState, setBookingState] = useState<'selecting' | 'confirming' | 'booking' | 'success'>('selecting');
  
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 10, 1)); // Nov 2025
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>([]);
  const [message, setMessage] = useState('');


  useEffect(() => {
     // Pre-select Nov 10, 2025 to match the image
     const initialDate = new Date(2025, 10, 10);
     if (MOCK_AVAILABLE_DATES_IN_MONTH.includes(initialDate.getDate())) {
         setSelectedDate(initialDate);
     }
  }, []);

  useEffect(() => {
    if (bookingState === 'success') {
      const timer = setTimeout(onClose, 2500);
      return () => clearTimeout(timer);
    }
  }, [bookingState, onClose]);

  const handleConfirmBooking = () => {
    setBookingState('booking');
    setTimeout(() => setBookingState('success'), 1500);
  };

  const changeMonth = (offset: number) => {
    setCurrentMonth(prev => {
        const newMonth = new Date(prev);
        newMonth.setMonth(prev.getMonth() + offset);
        return newMonth;
    });
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const renderCalendar = () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const startDate = new Date(monthStart);
    // Start calendar on the Sunday of the week of the 1st
    startDate.setDate(startDate.getDate() - monthStart.getDay());
    
    // Display 5 weeks, as shown in the reference image
    const days = [];
    for (let i = 0; i < 35; i++) {
        const day = new Date(startDate);
        day.setDate(startDate.getDate() + i);
        
        const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
        const isAvailable = isCurrentMonth && MOCK_AVAILABLE_DATES_IN_MONTH.includes(day.getDate());
        const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();

        const getDayCx = () => {
            if (isSelected) return 'bg-brand-primary text-white font-bold hover:bg-brand-primary/90';
            if (isAvailable) return 'bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20';
            if (isCurrentMonth) return 'text-gray-400 dark:text-gray-500 cursor-not-allowed';
            return 'text-transparent cursor-default';
        };

        days.push(
            <div key={day.toISOString()} className="flex justify-center items-center h-10">
                <button
                    onClick={() => { if (isAvailable) { setSelectedDate(day); setSelectedTime(null); } }}
                    disabled={!isAvailable}
                    className={`w-9 h-9 flex items-center justify-center rounded-full text-sm transition-colors duration-200 ${getDayCx()}`}
                >
                    {day.getDate()}
                </button>
            </div>
        );
    }
    return days;
  };
  
  const handleChapterToggle = (chapterId: string) => {
    setSelectedChapterIds(prev =>
      prev.includes(chapterId)
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const renderTimeSlots = () => {
      if (!selectedDate) {
          return (
            <div className="p-4 flex items-center justify-center h-full text-content/60">
                <p>Select a date to see available times.</p>
            </div>
          );
      }
      
      if (selectedTime) {
          return (
              <div className="p-4 flex flex-col h-full">
                  <p className="font-semibold text-center mb-2">
                    Confirm booking for <br/> {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime}?
                  </p>
                  <div className="my-2 space-y-3 flex-grow overflow-y-auto">
                      <div>
                          <label className="block text-sm font-medium text-content mb-1">Share chapters (optional)</label>
                          <div className="max-h-32 overflow-y-auto space-y-1 p-2 border border-base-300 rounded-md">
                              {chapters.map(chapter => (
                                  <label key={chapter.id} className="flex items-center p-2 bg-base-200/50 rounded-md cursor-pointer hover:bg-base-200">
                                      <input
                                          type="checkbox"
                                          checked={selectedChapterIds.includes(chapter.id)}
                                          onChange={() => handleChapterToggle(chapter.id)}
                                          className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                                      />
                                      <span className="ml-2 text-sm font-medium text-content">{chapter.title}</span>
                                  </label>
                              ))}
                          </div>
                      </div>
                      <div>
                          <label htmlFor="teacher-message" className="block text-sm font-medium text-content mb-1">
                              Add a note (optional)
                          </label>
                          <textarea
                              id="teacher-message"
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              className="w-full p-2 text-sm border border-base-300 rounded-md focus:ring-2 focus:ring-brand-primary"
                              rows={2}
                              placeholder={`e.g., "Hi, I'd like to focus on..."`}
                          />
                      </div>
                  </div>
                  <div className="mt-auto">
                    <Button onClick={handleConfirmBooking} className="w-full mb-2">Confirm</Button>
                    <Button variant="ghost" onClick={() => setSelectedTime(null)} className="w-full">Back</Button>
                  </div>
              </div>
          )
      }

      return (
          <div className="p-4 space-y-3">
              {MOCK_AVAILABLE_TIMES.map(time => (
                  <Button 
                      key={time} 
                      variant="ghost" 
                      onClick={() => setSelectedTime(time)}
                      className="w-full !justify-center border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white focus:ring-brand-primary"
                  >
                      {time.replace('pm', '')}pm
                  </Button>
              ))}
          </div>
      )
  }

  const renderMainPanel = () => {
     switch (bookingState) {
      case 'booking':
        return <div className="flex flex-col items-center justify-center text-center p-6 h-full"><Spinner label="Confirming your session..." size="lg" /></div>;
      case 'success':
        return (
          <div className="flex flex-col items-center justify-center text-center p-6 h-full">
            <Icon icon="checkCircle" className="w-20 h-20 text-brand-secondary mb-4" />
            <h2 className="text-2xl font-bold">Session Booked!</h2>
            <p className="text-content/70 mt-2">
              Your session with {teacher.name} on {selectedDate?.toLocaleDateString()} at {selectedTime} has been confirmed.
            </p>
          </div>
        );
       default:
        return (
            <div className="w-full flex flex-col sm:flex-row h-full">
                {/* Calendar */}
                <div className="w-full sm:w-[60%] p-6 flex flex-col">
                    <div className="flex justify-between items-center my-4">
                        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-base-200" aria-label="Previous month"><Icon icon="chevron-left" className="w-5 h-5"/></button>
                        <h4 className="font-semibold text-center">
                            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h4>
                        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-base-200" aria-label="Next month"><Icon icon="chevron-right" className="w-5 h-5"/></button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs text-content/60 mb-1 font-semibold">
                        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => <div key={d}>{d}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
                     <div className="mt-auto pt-4 flex items-center gap-2 text-sm text-content/80">
                         <Icon icon="globe" className="w-5 h-5" />
                         <span>Moldova Time (12:37am)</span>
                         <span className="text-brand-primary cursor-pointer">▼</span>
                     </div>
                </div>
                {/* Time Slots */}
                <div className="w-full sm:w-[40%] border-t sm:border-l sm:border-t-0 border-base-300 overflow-y-auto">
                    {selectedDate && (
                        <div className="p-4 font-semibold text-center border-b border-base-300">
                            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </div>
                    )}
                    {renderTimeSlots()}
                </div>
            </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto md:h-[550px] md:overflow-hidden p-0 flex flex-col md:flex-row shadow-2xl relative" onClick={e => e.stopPropagation()}>
          <div className="hidden sm:block absolute top-0 right-0 m-1 z-10">
            <a href="https://calendly.com" target="_blank" rel="noopener noreferrer" className="block w-32 h-32" aria-label="Powered by Calendly">
                <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden">
                    <div style={{ transform: 'translate(29.29%, -29.29%) rotate(45deg)', transformOrigin: 'center center' }} className="absolute top-0 right-0 w-48 h-10 bg-gray-800 text-white text-[10px] font-bold flex items-center justify-center text-center leading-tight">
                        POWERED BY <br/> <span className="text-sm tracking-wider">Calendly</span>
                    </div>
                </div>
            </a>
          </div>
           <Button variant="ghost" className="!absolute top-2 right-2 z-20 md:hidden" onClick={onClose} aria-label="Close modal">
                <Icon icon="close" className="w-5 h-5"/>
           </Button>
          {/* Left Pane */}
          <div className="w-full md:w-1/3 border-b md:border-r md:border-b-0 border-base-300 p-6 flex flex-col bg-base-100">
              <div className="flex-grow">
                  <p className="text-content/70">{teacher.name}</p>
                  <h2 className="text-2xl font-bold my-2 text-content">30 Minute Meeting</h2>
                  <div className="flex items-center gap-2 text-content/70">
                      <Icon icon="clock" className="w-5 h-5" />
                      <span>30 min</span>
                  </div>
              </div>
              <div className="flex items-center justify-between text-sm mt-4">
                 <button className="text-sm text-brand-primary hover:underline">Cookie settings</button>
                 <Button variant="ghost" size="sm" className="border border-base-300" leftIcon={<Icon icon="wrench" className="w-4 h-4" />}>Troubleshoot</Button>
              </div>
          </div>
          {/* Right Pane */}
          <div className="w-full md:w-2/3 bg-base-100 flex flex-col">
              <h3 className="text-lg font-bold p-6 pb-0">Select a Date & Time</h3>
              <div className="flex-grow overflow-hidden">
                {renderMainPanel()}
              </div>
          </div>
      </Card>
    </div>
  );
};