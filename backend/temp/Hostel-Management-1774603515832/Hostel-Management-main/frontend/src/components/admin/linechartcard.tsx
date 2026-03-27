import React from 'react';

interface LineChartCardProps {
  title: string;
}

const LineChartCard: React.FC<LineChartCardProps> = ({ title }) => {
  // Mock chart data points for the SVG
  const dataPoints = [
    { x: 0, y: 60 },
    { x: 50, y: 80 },
    { x: 100, y: 45 },
    { x: 150, y: 70 },
    { x: 200, y: 55 },
    { x: 250, y: 85 },
    { x: 300, y: 65 },
    { x: 350, y: 90 }
  ];

  // Generate path string for the line
  const pathData = dataPoints.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Breakfast</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-gray-600">Lunch</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Dinner</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <svg width="100%" height="200" viewBox="0 0 400 120" className="overflow-visible">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="50" height="20" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Chart lines */}
          <path 
            d={pathData}
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            className="drop-shadow-sm"
          />
          
          {/* Data points */}
          {dataPoints.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="3"
              fill="#10b981"
              className="drop-shadow-sm"
            />
          ))}
        </svg>
        
        {/* X-axis labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>May</span>
          <span>Jun</span>
          <span>Jul</span>
          <span>Aug</span>
        </div>
      </div>
    </div>
  );
};

export default LineChartCard;