import React from 'react';

const colorMap = {
  'border-blue-500': { border: 'border-blue-500', bg: 'bg-blue-100', text: 'text-blue-500' },
  'border-yellow-500': { border: 'border-yellow-500', bg: 'bg-yellow-100', text: 'text-yellow-500' },
  'border-purple-500': { border: 'border-purple-500', bg: 'bg-purple-100', text: 'text-purple-500' },
  'border-orange-500': { border: 'border-orange-500', bg: 'bg-orange-100', text: 'text-orange-500' },
  'border-green-500': { border: 'border-green-500', bg: 'bg-green-100', text: 'text-green-500' },
  'border-red-500': { border: 'border-red-500', bg: 'bg-red-100', text: 'text-red-500' },
  'border-emerald-500': { border: 'border-emerald-500', bg: 'bg-emerald-100', text: 'text-emerald-500' },
  'border-yellow-600': { border: 'border-yellow-600', bg: 'bg-yellow-100', text: 'text-yellow-600' },
  '#3B82F6': { border: 'border-blue-500', bg: 'bg-blue-100', text: 'text-blue-500' },
  '#15803D': { border: 'border-green-500', bg: 'bg-green-100', text: 'text-green-500' },
  '#D4A017': { border: 'border-yellow-500', bg: 'bg-yellow-100', text: 'text-yellow-500' },
  '#E8742A': { border: 'border-orange-500', bg: 'bg-orange-100', text: 'text-orange-500' },
};
const defaultColor = { border: 'border-gray-500', bg: 'bg-gray-100', text: 'text-gray-500' };

const StatsCard = ({ title, value, icon: Icon, color, subtitle }) => {
  const colors = colorMap[color] || defaultColor;

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${colors.border}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#6B4F3A] mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-[#2C1810]">{value}</h3>
          {subtitle && (
            <p className="text-xs text-[#6B4F3A] mt-2">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colors.bg} ${colors.text}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
