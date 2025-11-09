import React, { useState, useMemo } from 'react';
import { Card } from './common/Card';
import { Student, Teacher, Chapter, BookedSession } from '../types';
import { MOCK_TEACHERS, MOCK_BOOKED_SESSIONS } from '../constants';
import { Button } from './common/Button';
import { Icon } from './common/Icon';
import { BookingModal } from './BookingModal';
import { BookedSessions } from './BookedSessions';

interface TeachersViewProps {
  student: Student;
  chapters: Chapter[];
}

const TeacherCard: React.FC<{ teacher: Teacher; onBook: () => void }> = ({ teacher, onBook }) => (
  <Card className="flex flex-col items-center text-center">
    <img src={teacher.avatarUrl} alt={teacher.name} className="w-20 h-20 rounded-full mb-4" />
    <h4 className="font-bold">{teacher.name}</h4>
    <p className="text-sm text-content/70">{teacher.specialty}</p>
    <div className="flex items-center gap-1 text-sm my-1">
        <Icon icon="star" className="w-4 h-4 text-yellow-500" />
        <span className="font-bold">{teacher.rating}</span>
    </div>
    <p className={`text-xs font-semibold mt-1 ${teacher.isVolunteer ? 'text-green-600 dark:text-green-400' : 'text-indigo-600 dark:text-indigo-400'}`}>{teacher.isVolunteer ? 'Volunteer' : 'Professional'}</p>
    <Button className="mt-4 w-full" onClick={onBook}>Book Session</Button>
  </Card>
);

const TabButton: React.FC<{label: string; isActive: boolean; onClick: () => void;}> = ({label, isActive, onClick}) => (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${isActive ? 'bg-brand-primary/10 text-brand-primary' : 'text-content/60 hover:bg-base-300/50'}`}>
        {label}
    </button>
);


export const TeachersView: React.FC<TeachersViewProps> = ({ student, chapters }) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  // State for teacher filtering
  const [activeTab, setActiveTab] = useState<'recommended' | 'all'>('recommended');
  const [specialtyFilter, setSpecialtyFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [typeFilter, setTypeFilter] = useState('All');

  const handleBookSession = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedTeacher(null);
  };
  
  const handleJoinSession = (session: BookedSession) => {
    window.open(session.meetLink, '_blank', 'noopener,noreferrer');
  };

  const studentSubjects = useMemo(() => {
    return [...new Set(chapters.map(c => c.subject))];
  }, [chapters]);
  
  const allSpecialties = useMemo(() => {
     return ['All', ...new Set(MOCK_TEACHERS.map(t => t.specialty))];
  }, []);

  const recommendedTeachers = useMemo(() => {
    if (studentSubjects.length === 0) return MOCK_TEACHERS.slice(0, 5); // Recommend a few if no subjects exist
    const recommended = MOCK_TEACHERS.filter(teacher => studentSubjects.includes(teacher.specialty));
    return recommended.length > 0 ? recommended : MOCK_TEACHERS.slice(0,5);
  }, [studentSubjects]);

  const filteredTeachers = useMemo(() => {
    return MOCK_TEACHERS.filter(teacher => {
      const specialtyMatch = specialtyFilter === 'All' || teacher.specialty === specialtyFilter;
      const ratingMatch = teacher.rating >= ratingFilter;
      const typeMatch = typeFilter === 'All'
        || (typeFilter === 'Professional' && !teacher.isVolunteer)
        || (typeFilter === 'Volunteer' && teacher.isVolunteer);
      return specialtyMatch && ratingMatch && typeMatch;
    });
  }, [specialtyFilter, ratingFilter, typeFilter]);
  
  const teachersToShow = activeTab === 'recommended' ? recommendedTeachers : filteredTeachers;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {isBookingModalOpen && selectedTeacher && (
        <BookingModal teacher={selectedTeacher} chapters={chapters} onClose={handleCloseBookingModal} />
      )}
      
      <h2 className="text-3xl font-bold text-content mb-6">Connect with a Teacher</h2>
        
      <BookedSessions sessions={MOCK_BOOKED_SESSIONS} onJoin={handleJoinSession} />

      <h3 className="text-2xl font-bold text-content mb-4">Find a New Teacher</h3>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="flex items-center gap-2 border border-base-300 bg-base-100 p-1 rounded-lg">
              <TabButton label="Recommended For You" isActive={activeTab === 'recommended'} onClick={() => setActiveTab('recommended')} />
              <TabButton label="All Teachers" isActive={activeTab === 'all'} onClick={() => setActiveTab('all')} />
          </div>

          {activeTab === 'all' && (
              <div className="flex flex-wrap items-center gap-3">
                  <select value={specialtyFilter} onChange={e => setSpecialtyFilter(e.target.value)} className="bg-base-100 border border-base-300 rounded-md px-3 py-1.5 text-sm focus:ring-brand-primary focus:border-brand-primary">
                      {allSpecialties.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                   <select value={ratingFilter} onChange={e => setRatingFilter(Number(e.target.value))} className="bg-base-100 border border-base-300 rounded-md px-3 py-1.5 text-sm focus:ring-brand-primary focus:border-brand-primary">
                      <option value={0}>Any Rating</option>
                      <option value={4}>4 Stars & Up</option>
                      <option value={4.5}>4.5 Stars & Up</option>
                       <option value={4.8}>4.8 Stars & Up</option>
                  </select>
                   <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="bg-base-100 border border-base-300 rounded-md px-3 py-1.5 text-sm focus:ring-brand-primary focus:border-brand-primary">
                      <option value="All">All Types</option>
                      <option value="Professional">Professional</option>
                      <option value="Volunteer">Volunteer</option>
                  </select>
              </div>
          )}
      </div>
      
      {teachersToShow.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {teachersToShow.map(teacher => <TeacherCard key={teacher.id} teacher={teacher} onBook={() => handleBookSession(teacher)} />)}
          </div>
      ) : (
          <div className="text-center py-12 bg-base-100 rounded-lg">
              <Icon icon="search" className="mx-auto w-12 h-12 text-content/30 mb-4" />
              <h4 className="font-bold text-lg">No teachers found</h4>
              <p className="text-content/60 text-sm mt-1">
                  {activeTab === 'recommended' 
                      ? "We couldn't find any teachers matching your current chapter subjects."
                      : "Try adjusting your filters to find more teachers."}
              </p>
          </div>
      )}
    </div>
  );
};