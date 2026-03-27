import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

// API Configuration
const API_BASE_URL = 'http://localhost:8080/api/fees';

// StatsCard component
interface StatsCardProps {
  title: string;
  value: string;
  bgColor: string;
  textColor?: string;
  icon?: React.ReactNode;
  trend?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  bgColor, 
  textColor = "white",
  icon,
  trend
}) => {
  return (
    <div 
      className="rounded-xl p-6 shadow-lg relative overflow-hidden min-h-[120px] flex flex-col justify-between transition-transform hover:scale-105"
      style={{ backgroundColor: bgColor }}
    >
      <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full"></div>
      <div className="absolute -right-8 -top-8 w-16 h-16 bg-white/5 rounded-full"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium opacity-80" style={{ color: textColor }}>
            {title}
          </h3>
          {icon && (
            <div className="opacity-60" style={{ color: textColor }}>
              {icon}
            </div>
          )}
        </div>
        <div className="flex items-end justify-between">
          <p className="text-2xl font-bold" style={{ color: textColor }}>
            {value}
          </p>
          {trend && (
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 opacity-60" style={{ color: textColor }} />
              <span className="text-xs opacity-60" style={{ color: textColor }}>{trend}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Fee breakdown chart component
interface FeeBreakdownChartProps {
  paidPercent: number;
  pendingPercent: number;
}

const FeeBreakdownChart: React.FC<FeeBreakdownChartProps> = ({ paidPercent, pendingPercent }) => {
  const data = [
    { label: 'Paid', value: paidPercent, color: '#10B981' },
    { label: 'Pending', value: pendingPercent, color: '#F59E0B' }
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col" style={{ height: '400px' }}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Fee Breakdown</h3>
      
      <div className="flex items-center justify-center mb-6 flex-grow">
        <div className="relative w-48 h-48">
          <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="8"
            />
            
            {data.map((item, index) => {
              const circumference = 2 * Math.PI * 40;
              const percentage = item.value / total;
              const strokeDasharray = `${percentage * circumference} ${circumference}`;
              
              const prevPercentages = data.slice(0, index).reduce((sum, prev) => sum + prev.value / total, 0);
              const strokeDashoffset = -prevPercentages * circumference;
              
              return (
                <circle
                  key={item.label}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={item.color}
                  strokeWidth="8"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">{total.toFixed(1)}%</span>
            <span className="text-base text-gray-500">Total</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-base text-gray-600">{item.label}</span>
            </div>
            <span className="text-base font-medium text-gray-900">{item.value.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Fees component
const Fees: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for API data
  const [collectionPercent, setCollectionPercent] = useState<number>(0);
  const [pendingFees, setPendingFees] = useState<number>(0);
  const [paidFees, setPaidFees] = useState<number>(0);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [paidCountPercent, setPaidCountPercent] = useState<number>(0);
  const [pendingCountPercent, setPendingCountPercent] = useState<number>(0);
  const [feeInfo, setFeeInfo] = useState<any[]>([]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [
          collectionRes,
          pendingFeesRes,
          paidFeesRes,
          pendingCountRes,
          paidCountPercentRes,
          pendingCountPercentRes,
          feeInfoRes
        ] = await Promise.all([
          fetch(`${API_BASE_URL}/admin/collection-percent`),
          fetch(`${API_BASE_URL}/admin/pending-fees`),
          fetch(`${API_BASE_URL}/admin/fees/paid-fees`),
          fetch(`${API_BASE_URL}/admin/fees/pending-count`),
          fetch(`${API_BASE_URL}/admin/fees/graph/paid-count-percent`),
          fetch(`${API_BASE_URL}/admin/fees/graph/pending-count-percent`),
          fetch(`${API_BASE_URL}/admin/fees/table`)
        ]);

        setCollectionPercent(await collectionRes.json());
        setPendingFees(await pendingFeesRes.json());
        setPaidFees(await paidFeesRes.json());
        setPendingCount(await pendingCountRes.json());
        setPaidCountPercent(await paidCountPercentRes.json());
        setPendingCountPercent(await pendingCountPercentRes.json());
        setFeeInfo(await feeInfoRes.json());
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch data from API. Please ensure the backend is running on http://localhost:8080');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status?.toLowerCase()) {
      case 'paid':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const formatAmount = (amount: number) => {
    if (!amount) return '₹0';
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading fee data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center mb-2">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            <h3 className="text-red-800 font-semibold">Error</h3>
          </div>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  const totalCollected = paidFees;

  return (
    <div className="space-y-6 p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Collected" 
          value={formatAmount(totalCollected)} 
          bgColor="#10B981" 
          icon={<CheckCircle className="w-5 h-5" />} 
          trend="↗" 
        />
        <StatsCard 
          title="Pending Fees" 
          value={formatAmount(pendingFees)} 
          bgColor="#F59E0B" 
          icon={<AlertTriangle className="w-5 h-5" />} 
          trend="↓" 
        />
        <StatsCard 
          title="Collection %" 
          value={`${collectionPercent.toFixed(0)}%`} 
          bgColor="#3B82F6" 
          icon={<TrendingUp className="w-5 h-5" />} 
        />
        <StatsCard 
          title="Students with Pending Fees" 
          value={pendingCount.toString()} 
          bgColor="#6B7280" 
          icon={<Users className="w-5 h-5" />} 
        />
      </div>

{/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm flex flex-col" style={{ height: '600px' }}>
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Students Fee Information</h2>
            </div>
            <div className="overflow-auto flex-1">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room No.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {feeInfo.length > 0 ? (
                    feeInfo.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {row[0] || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {row[1] || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {row[2] || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatAmount(row[3])}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusBadge(row[4])}>
                            {row[4] ? row[4].charAt(0).toUpperCase() + row[4].slice(1).toLowerCase() : 'Unknown'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No fee information available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side Charts */}
        <div className="space-y-6">
          <FeeBreakdownChart 
            paidPercent={paidCountPercent} 
            pendingPercent={pendingCountPercent} 
          />
        </div>
      </div>
    </div>
  );
};

export default Fees;