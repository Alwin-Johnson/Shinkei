import React, { useState } from 'react';
import { TrendingUp, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Enhanced StatsCard component with hover animation
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
  icon,
  trend
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="rounded-xl p-6 shadow-lg relative overflow-hidden min-h-[120px] flex flex-col justify-between cursor-pointer transition-all duration-300 ease-in-out"
      style={{ 
        backgroundColor: bgColor,
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        boxShadow: isHovered ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative background shapes */}
      <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full"></div>
      <div className="absolute -right-8 -top-8 w-16 h-16 bg-white/5 rounded-full"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-white/80">
            {title}
          </h3>
          {icon && (
            <div className="text-white/60">
              {icon}
            </div>
          )}
        </div>
        <div className="flex items-end justify-between">
          <p className="text-2xl font-bold text-white">
            {value}
          </p>
          {trend && (
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-white/60" />
              <span className="text-xs text-white/60">{trend}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced LineChartCard component with meal selection
interface LineChartCardProps {
  title: string;
}

const LineChartCard: React.FC<LineChartCardProps> = ({ title }) => {
  const [selectedMeal, setSelectedMeal] = useState('breakfast');

  // Mock data for different meals
  const mealData = {
    breakfast: [
      { name: 'Mon', skipped: 45 },
      { name: 'Tue', skipped: 52 },
      { name: 'Wed', skipped: 38 },
      { name: 'Thu', skipped: 61 },
      { name: 'Fri', skipped: 42 },
      { name: 'Sat', skipped: 28 },
      { name: 'Sun', skipped: 35 }
    ],
    lunch: [
      { name: 'Mon', skipped: 23 },
      { name: 'Tue', skipped: 28 },
      { name: 'Wed', skipped: 19 },
      { name: 'Thu', skipped: 35 },
      { name: 'Fri', skipped: 25 },
      { name: 'Sat', skipped: 15 },
      { name: 'Sun', skipped: 18 }
    ],
    dinner: [
      { name: 'Mon', skipped: 67 },
      { name: 'Tue', skipped: 72 },
      { name: 'Wed', skipped: 58 },
      { name: 'Thu', skipped: 81 },
      { name: 'Fri', skipped: 65 },
      { name: 'Sat', skipped: 45 },
      { name: 'Sun', skipped: 52 }
    ]
  };

  const getMealColor = (meal: string) => {
    switch (meal) {
      case 'breakfast': return '#F59E0B';
      case 'lunch': return '#10B981';
      case 'dinner': return '#3B82F6';
      default: return '#F59E0B';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        
        {/* Meal Selection Buttons */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {['breakfast', 'lunch', 'dinner'].map((meal) => (
            <button
              key={meal}
              onClick={() => setSelectedMeal(meal)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                selectedMeal === meal
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {meal.charAt(0).toUpperCase() + meal.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mealData[selectedMeal as keyof typeof mealData]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value} students`, `Skipped ${selectedMeal}`]}
              labelStyle={{ color: '#374151' }}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="skipped" 
              stroke={getMealColor(selectedMeal)}
              strokeWidth={3}
              dot={{ fill: getMealColor(selectedMeal), strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: getMealColor(selectedMeal), strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ListCard component
interface ListItem {
  label: string;
  value: number | string;
  sublabel: string;
}

interface ListCardProps {
  title: string;
  items: ListItem[];
}

const ListCard: React.FC<ListCardProps> = ({ title, items }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between py-2">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{item.label}</p>
              <p className="text-xs text-gray-500">{item.sublabel}</p>
            </div>
            <div className="text-lg font-semibold text-gray-900">
              {typeof item.value === 'number' && item.value > 100 ? item.value.toLocaleString() : item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  // Updated stats data with proper values and icons
  const statsData = [
    {
      title: "Total Students",
      value: "2,600",
      bgColor: "#4F46E5",
      icon: <Users className="w-5 h-5" />,
      trend: "↗"
    },
    {
      title: "Fee Collection %",
      value: "38%",
      bgColor: "#10B981",
      icon: <CheckCircle className="w-5 h-5" />,
      trend: "↗"
    },
    {
      title: "Pending Fees",
      value: "₹31,000",
      bgColor: "#F59E0B",
      icon: <AlertTriangle className="w-5 h-5" />,
      trend: "↓"
    },
    {
      title: "Active Complaints",
      value: "10",
      bgColor: "#EF4444",
      icon: <AlertTriangle className="w-5 h-5" />,
      trend: "!"
    }
  ];

  // Mock data for quick stats
  const quickStats = [
    { label: "New Admissions", value: 156, sublabel: "This month" },
    { label: "Pending Applications", value: 89, sublabel: "Awaiting approval" },
    { label: "Total Capacity", value: 500, sublabel: "Available rooms" },
    { label: "Occupancy Rate", value: "85%", sublabel: "Currently occupied" }
  ];

  // Mock data for recent complaints
  const recentComplaints = [
    { label: "Room Issues", value: 8, sublabel: "Maintenance required" },
    { label: "Food Quality", value: 12, sublabel: "Mess complaints" },
    { label: "Internet", value: 3, sublabel: "Network issues" },
    { label: "Cleaning", value: 5, sublabel: "Housekeeping" }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statsData.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            bgColor={stat.bgColor}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Main Content Section - Chart on Left, Cards on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart takes 2 columns */}
        <div className="lg:col-span-2">
          <LineChartCard title="Skipped Meals Trends" />
        </div>

        {/* Right side cards stack vertically */}
        <div className="space-y-6">
          <ListCard title="Quick Stats" items={quickStats} />
          <ListCard title="Recent Complaints" items={recentComplaints} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;