import React, { useState } from 'react';
import { 
  Utensils,
  ArrowLeft,
  Calendar,
  Mail,
  Phone,
  MapPin,
  User,
  GraduationCap,
  CreditCard,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface MessHistoryRecord {
  date: string;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  cost: number;
}

interface Student {
  messHistory: MessHistoryRecord[];
  id: string;
  avatar: string;
  name: string;
  studentId: string;
  roomNo: string;
  block: string;
  floor?: string;
  roommates?: string[];
  rent?: number;
  course?: string;
  stream?: string;
  year?: string;
  admissionDate: string;
  feeStatus: 'paid' | 'pending';
  dueAmount: number;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  mailingAddress?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianAddress?: string;
  feeHistory?: FeeRecord[];
}

interface FeeRecord {
  invoiceId: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending';
}

interface StudentProfileProps {
  student: Student;
  onBack: () => void;
}

const MessCalendar: React.FC<{ messHistory: MessHistoryRecord[] }> = ({ messHistory }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getMessRecord = (year: number, month: number, day: number) => {
    const dateKey = formatDateKey(year, month, day);
    return messHistory.find(record => record.date === dateKey);
  };

  const getSkippedMealBackground = (messRecord: MessHistoryRecord | undefined) => {
    if (!messRecord) return 'bg-white';
    
    const skippedMeals = [];
    if (!messRecord.breakfast) skippedMeals.push('breakfast');
    if (!messRecord.lunch) skippedMeals.push('lunch');
    if (!messRecord.dinner) skippedMeals.push('dinner');
    
    if (skippedMeals.length === 0) return 'bg-white';
    
    if (skippedMeals.length === 3) return 'bg-red-500';
    if (skippedMeals.length === 2) return 'bg-purple-500';
    
    if (skippedMeals.includes('breakfast')) return 'bg-emerald-500';
    if (skippedMeals.includes('lunch')) return 'bg-amber-500';
    if (skippedMeals.includes('dinner')) return 'bg-blue-500';
    
    return 'bg-white';
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderCalendarDays = () => {
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-16"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const messRecord = getMessRecord(year, month, day);
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
      const backgroundClass = getSkippedMealBackground(messRecord);

      days.push(
        <div
          key={day}
          className={`h-16 border border-gray-300 p-2 ${backgroundClass} ${
            isToday ? 'ring-2 ring-indigo-600' : ''
          }`}
        >
          <div className={`text-sm font-bold mb-1 ${
            backgroundClass === 'bg-white' ? 'text-gray-900' : 'text-white'
          }`}>
            {day}
          </div>
          {messRecord && (
            <div className={`text-xs font-bold ${
              backgroundClass === 'bg-white' ? 'text-gray-800' : 'text-white'
            }`}>
              ₹{messRecord.cost}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold text-gray-900">
          {monthNames[month]} {year}
        </h3>
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-3 text-base">Skipped Meals (Background Color)</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-4 bg-emerald-500 border border-gray-400 rounded"></div>
            <span className="text-gray-700 font-medium">Breakfast skipped</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-4 bg-amber-500 border border-gray-400 rounded"></div>
            <span className="text-gray-700 font-medium">Lunch skipped</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-4 bg-blue-500 border border-gray-400 rounded"></div>
            <span className="text-gray-700 font-medium">Dinner skipped</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-4 bg-purple-500 border border-gray-400 rounded"></div>
            <span className="text-gray-700 font-medium">2 meals skipped</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-4 bg-red-500 border border-gray-400 rounded"></div>
            <span className="text-gray-700 font-medium">All meals skipped</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {dayNames.map(day => (
          <div key={day} className="h-8 flex items-center justify-center text-sm font-semibold text-gray-600 bg-gray-100">
            {day}
          </div>
        ))}
        {renderCalendarDays()}
      </div>
    </div>
  );
};

const StudentProfile: React.FC<StudentProfileProps> = ({ student, onBack }) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const getStatusClasses = () => {
      const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
      
      switch (status) {
        case 'paid':
          return `${baseClasses} bg-green-100 text-green-700`;
        case 'pending':
          return `${baseClasses} bg-yellow-100 text-yellow-700`;
        default:
          return `${baseClasses} bg-gray-100 text-gray-700`;
      }
    };

    return (
      <span className={getStatusClasses()}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const InfoCard = ({ icon: Icon, title, children, iconBg, iconColor }: any) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-200">
      <div className="flex items-center mb-4">
        <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center mr-3`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );

  const InfoRow = ({ label, value, icon: Icon }: any) => (
    <div className="flex items-start py-2">
      {Icon && <Icon className="w-4 h-4 text-gray-400 mr-2 mt-1 flex-shrink-0" />}
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-500 mb-0.5">{label}</div>
        <div className="text-sm font-medium text-gray-900 break-words">{value || 'Not provided'}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 mb-6 text-blue-600 hover:text-blue-700 hover:bg-white/80 rounded-xl transition-all duration-200 backdrop-blur-sm shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 rounded-2xl shadow-2xl p-8 mb-6 text-white">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-28 h-28 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center shadow-2xl ring-4 ring-white/30">
              <span className="text-5xl font-bold">{student.avatar}</span>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-3">{student.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <div className="text-xs opacity-90">Student ID</div>
                  <div className="text-lg font-bold">{student.studentId}</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <div className="text-xs opacity-90">Room</div>
                  <div className="text-lg font-bold">{student.roomNo}</div>
                </div>
                {student.course && (
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <div className="text-xs opacity-90">Course</div>
                    <div className="text-lg font-bold">{student.course}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
          <InfoCard icon={User} title="Basic Information" iconBg="bg-blue-100" iconColor="text-blue-600">
            <div className="space-y-1">
              <InfoRow label="Full Name" value={student.name} />
              <InfoRow label="College ID" value={student.studentId} />
              <InfoRow label="Gender" value={student.gender} />
              <InfoRow label="Date of Birth" value={student.dateOfBirth ? formatDate(student.dateOfBirth) : undefined} icon={Calendar} />
              <InfoRow label="Admission Date" value={formatDate(student.admissionDate)} icon={Calendar} />
            </div>
          </InfoCard>

          <InfoCard icon={Phone} title="Contact Details" iconBg="bg-green-100" iconColor="text-green-600">
            <div className="space-y-1">
              <InfoRow label="Email Address" value={student.email} icon={Mail} />
              <InfoRow label="Phone Number" value={student.phone} icon={Phone} />
              <InfoRow label="Mailing Address" value={student.mailingAddress} icon={MapPin} />
            </div>
          </InfoCard>

          <InfoCard icon={GraduationCap} title="Academic Details" iconBg="bg-purple-100" iconColor="text-purple-600">
            <div className="space-y-1">
              <InfoRow label="Course" value={student.course} />
              <InfoRow label="Stream" value={student.stream} />
              <InfoRow label="Year" value={student.year} />
              <InfoRow label="Admission Date" value={formatDate(student.admissionDate)} />
            </div>
          </InfoCard>

          <InfoCard icon={MapPin} title="Hostel Details" iconBg="bg-orange-100" iconColor="text-orange-600">
            <div className="space-y-1">
              <InfoRow label="Room Number" value={student.roomNo} />
              <InfoRow label="Block" value={student.block} />
              <InfoRow label="Floor" value={student.floor} />
              {student.roommates && student.roommates.length > 0 && (
                <div className="pt-2">
                  <div className="text-xs text-gray-500 mb-2">Roommates</div>
                  <div className="space-y-1">
                    {student.roommates.map((mate, idx) => (
                      <div key={idx} className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-1.5 rounded-lg">
                        {mate}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {student.rent && (
                <div className="pt-2">
                  <div className="bg-orange-50 px-3 py-2 rounded-lg">
                    <div className="text-xs text-orange-600 mb-0.5">Monthly Rent</div>
                    <div className="text-lg font-bold text-orange-900">{formatCurrency(student.rent)}</div>
                  </div>
                </div>
              )}
            </div>
          </InfoCard>

          <InfoCard icon={User} title="Guardian Details" iconBg="bg-teal-100" iconColor="text-teal-600">
            <div className="space-y-1">
              <InfoRow label="Guardian Name" value={student.guardianName} />
              <InfoRow label="Phone Number" value={student.guardianPhone} icon={Phone} />
              <InfoRow label="Address" value={student.guardianAddress} icon={MapPin} />
            </div>
          </InfoCard>

          <InfoCard icon={Utensils} title="Mess Summary" iconBg="bg-pink-100" iconColor="text-pink-600">
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-700">
                  {student.messHistory?.filter(record => record.breakfast).length || 0}
                </div>
                <div className="text-xs text-green-600 font-medium">Breakfast</div>
              </div>
              <div className="text-center bg-amber-50 p-3 rounded-lg border border-amber-200">
                <div className="text-2xl font-bold text-amber-700">
                  {student.messHistory?.filter(record => record.lunch).length || 0}
                </div>
                <div className="text-xs text-amber-600 font-medium">Lunch</div>
              </div>
              <div className="text-center bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-700">
                  {student.messHistory?.filter(record => record.dinner).length || 0}
                </div>
                <div className="text-xs text-blue-600 font-medium">Dinner</div>
              </div>
            </div>
            <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
              <div className="text-sm text-pink-700 font-semibold mb-1">Total Mess Cost</div>
              <div className="text-2xl font-bold text-pink-900">
                {formatCurrency(student.messHistory?.reduce((total, record) => total + record.cost, 0) || 0)}
              </div>
            </div>
          </InfoCard>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 mb-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
              <Calendar className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Mess Calendar</h3>
          </div>
          <MessCalendar messHistory={student.messHistory || []} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
              <CreditCard className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Fee History</h3>
          </div>
          {student.feeHistory && student.feeHistory.length > 0 ? (
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Invoice ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {student.feeHistory.map((fee) => (
                    <tr key={fee.invoiceId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{fee.invoiceId}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(fee.date)}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{formatCurrency(fee.amount)}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={fee.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No fee history available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;