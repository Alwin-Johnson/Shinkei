import React from 'react';

interface ListItem {
  label: string;
  value: number;
  sublabel?: string;
}

interface ListCardProps {
  title: string;
  items: ListItem[];
}

const ListCard: React.FC<ListCardProps> = ({ title, items }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="text-xs text-gray-500">See All</span>
      </div>
      
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                {item.sublabel && (
                  <p className="text-xs text-gray-500">{item.sublabel}</p>
                )}
              </div>
            </div>
            <span className="text-sm font-semibold text-gray-700">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListCard;