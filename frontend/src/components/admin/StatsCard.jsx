import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color, subtitle }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${color}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#6B4F3A] mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-[#2C1810]">{value}</h3>
          {subtitle && (
            <p className="text-xs text-[#6B4F3A] mt-2">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color.replace('border-', 'bg-').replace('500', '100')} ${color.replace('border-', 'text-')}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
