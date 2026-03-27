import React, { useEffect, useState } from 'react';
import { Button } from '../../components/student/button';
import { ArrowLeft } from 'lucide-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

interface StudentPortalProps {
  onPageChange?: (page: string) => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({ onPageChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'login' | 'admission'>('login');

  useEffect(() => {
    if (location.pathname.includes('login')) setActiveTab('login');
    else if (location.pathname.includes('new-admission')) setActiveTab('admission');
    else if (location.pathname.includes('landing')) navigate('/'); 
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-3xl px-6 py-8 text-center">
        {onPageChange && (
          <div className="flex justify-start mb-4">
            
          </div>
        )}

        {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-20 text-gray-600 hover:text-blue-600 hover:bg-blue-50/80 transition-all duration-300 group rounded-xl backdrop-blur-sm"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
        Back to Home
      </Button>

        <h1 className="text-3xl font-bold text-gray-900">Student Portal</h1>
        <p className="text-sm md:text-lg text-gray-600 mt-1">Login or Apply for New Admission</p>

        <div className="flex justify-center mt-6 border-b border-gray-200">
          <button
            onClick={() => navigate('login')}
            className={`px-6 py-3 text-lg font-semibold transition-colors ${
              activeTab === 'login'
                ? 'border-b-4 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => navigate('new-admission')}
            className={`px-6 py-3 text-lg font-semibold transition-colors ${
              activeTab === 'admission'
                ? 'border-b-4 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            New Admission
          </button>
        </div>
      </div>

      {/* Child route content */}
      <div className="w-full max-w-3xl px-6 mt-8">
        <Outlet />
      </div>
    </div>
  );
};
