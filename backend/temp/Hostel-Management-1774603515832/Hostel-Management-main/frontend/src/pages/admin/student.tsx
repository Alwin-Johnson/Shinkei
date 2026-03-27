import React, { useState, useMemo} from 'react';
import { 
  Search,
  ChevronDown,
  X,
  Check,
  AlertCircle
} from 'lucide-react';
import Table, { TableColumn } from '../../components/admin/table';
import StudentProfile from './studentprofile';

interface Student {
  id: string;
  avatar: string;
  name: string;
  studentId: string;
  roomNo: string;
  block: string;
  admissionDate: string;
  feeStatus: 'paid' | 'pending';
  dueAmount: number;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  mailingAddress?: string;
  feeHistory?: FeeRecord[];
}

interface FeeRecord {
  invoiceId: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending';
}

// Notification Component
const Notification: React.FC<{
  type: 'success' | 'error' | 'info';
  message: string;
  onClose: () => void;
}> = ({ type, message, onClose }) => {
  const getNotificationClasses = () => {
    const baseClasses = "fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 min-w-80";
    switch (type) {
      case 'success':
        return `${baseClasses} bg-green-50 border border-green-200 text-green-800`;
      case 'error':
        return `${baseClasses} bg-red-50 border border-red-200 text-red-800`;
      case 'info':
        return `${baseClasses} bg-blue-50 border border-blue-200 text-blue-800`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'info':
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className={getNotificationClasses()}>
      {getIcon()}
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusClasses = () => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    switch (status) {
      case 'paid':
      case 'current':
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

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const Student: React.FC = () => {
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortConfig, setSortConfig] = useState<{ column: string; direction: 'asc' | 'desc' } | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Fetch student data from backend when component mounts
  React.useEffect(() => {
    fetch('http://localhost:8080/api/students/Admin/student/table')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load student data');
        return res.json();
      })
      .then(data => {
        // Map from array of objects with property keys
        const mappedData = data.map((row: any) => ({
          id: `ST${row.studentId}`,
          avatar: row.name ? row.name.split(' ').map((w: string) => w[0]).join('').toUpperCase() : '',
          name: row.name,
          studentId: `ST${row.studentId}`,
          roomNo: row.roomNo,
          admissionDate: row.admissionDate,
          feeStatus: row.feeStatus || 'pending',
          dueAmount: row.fee ?? 0
        }));
        setStudentsData(mappedData);
      })
      .catch(err => {
        setNotification({ type: 'error', message: 'Failed to load student data.' });
      });
  }, []);

  // Get unique blocks for filter dropdown
  const blocks = useMemo(() => Array.from(new Set(studentsData.map(student => student.block))), [studentsData]);

  const filteredStudents = useMemo(() => {
    let filtered = studentsData;
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.roomNo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedBlock) {
      filtered = filtered.filter(student => student.block === selectedBlock);
    }
    if (selectedStatus) {
      filtered = filtered.filter(student => student.feeStatus === selectedStatus);
    }
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.column as keyof Student];
        const bValue = b[sortConfig.column as keyof Student];
        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return sortConfig.direction === 'asc' ? 1 : -1;
        if (bValue === undefined) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return filtered;
  }, [searchTerm, selectedBlock, selectedStatus, sortConfig, studentsData]);

  const handleSort = (column: string, direction: 'asc' | 'desc') => setSortConfig({ column, direction });

  const handleStudentClick = (student: Student) => setSelectedStudent(student);

  if (selectedStudent) {
    return <StudentProfile student={selectedStudent} onBack={() => setSelectedStudent(null)} />;
  }

  const columns: TableColumn<Student>[] = [
    {
      key: 'name',
      header: 'Student',
      sortable: true,
      render: (_, student) => (
        <div
          className="flex items-center space-x-3 cursor-pointer hover:bg-blue-50 -m-2 p-2 rounded transition-colors"
          onClick={() => handleStudentClick(student)}
        >
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-700">{student.avatar}</span>
          </div>
          <div>
            <div className="font-medium text-gray-900 hover:text-blue-600 transition-colors">{student.name}</div>
            <div className="text-sm text-gray-500">{student.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'studentId',
      header: 'Student ID',
      sortable: true,
      render: value => <span className="font-mono text-sm">{value}</span>
    },
    {
      key: 'roomNo',
      header: 'Room No',
      render: (_, student) => (
        <div>
          <span className="font-medium text-sm">{student.roomNo}</span>
          <div className="text-xs text-gray-500">{student.block}</div>
        </div>
      )
    },
    {
      key: 'admissionDate',
      header: 'Admission Date',
      sortable: true,
      render: value => {
        const date = new Date(value);
        return (
          <span className="text-sm">
            {date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        );
      }
    },
    {
      key: 'feeStatus',
      header: 'Fee Status',
      render: value => <StatusBadge status={value} />
    },
    {
      key: 'dueAmount',
      header: 'Amount',
      sortable: true,
      render: value => (
        <span className={`font-medium 'text-gray-600'}`}>
          {formatCurrency(value)}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by Name / Student ID"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>
          <div className="relative">
            <select
              value={selectedBlock}
              onChange={e => setSelectedBlock(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Room</option>
              {blocks.map(block => (
                <option key={block} value={block}>{block}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Fee Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
      <div className="text-sm text-gray-600">
        Showing {filteredStudents.length} of {studentsData.length} students
      </div>
      <Table
        data={filteredStudents}
        columns={columns}
        selectable={false}
        onSort={handleSort}
        hoverable={true}
        emptyMessage="No students found"
      />
    </div>
  );
};

export default Student;