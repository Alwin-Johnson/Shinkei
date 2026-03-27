import React from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  bgColor: string;
  textColor?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  bgColor, 
  textColor = "white" 
}) => {
  return (
    <div 
      className={`rounded-xl p-6 shadow-lg relative overflow-hidden min-h-[120px] flex flex-col justify-between`}
      style={{ backgroundColor: bgColor }}
    >
      {/* Decorative background shape */}
      <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full"></div>
      <div className="absolute -right-8 -top-8 w-16 h-16 bg-white/5 rounded-full"></div>
      
      <div className="relative z-10">
        <h3 className={`text-sm font-medium mb-2 text-${textColor}/80`}>
          {title}
        </h3>
        <p className={`text-2xl font-bold text-${textColor}`}>
          {value}
        </p>
      </div>
    </div>
  );
};
export default StatsCard;