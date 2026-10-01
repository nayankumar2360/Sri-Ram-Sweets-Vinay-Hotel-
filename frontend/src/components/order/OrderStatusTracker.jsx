import React from 'react';

const OrderStatusTracker = ({ currentStatus }) => {
  const steps = [
    { id: 'pending', label: 'Placed' },
    { id: 'accepted', label: 'Accepted' },
    { id: 'payment_verified', label: 'Payment Verified' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'preparing', label: 'Preparing' },
    { id: 'ready', label: 'Ready / Out for Delivery' },
    { id: 'completed', label: 'Completed' }
  ];

  // Handle special cases
  if (currentStatus === 'rejected' || currentStatus === 'cancelled') {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
        This order has been {currentStatus}.
      </div>
    );
  }

  const currentIndex = steps.findIndex(s => 
    s.id === currentStatus || 
    (currentStatus === 'out_for_delivery' && s.id === 'ready')
  );

  return (
    <div className="py-6">
      <div className="relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 rounded hidden md:block"></div>
        <div className="absolute left-4 top-0 h-full w-1 bg-gray-200 rounded md:hidden"></div>
        
        <div className="relative flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
          {steps.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isPending = index > currentIndex;
            
            return (
              <div key={step.id} className="flex md:flex-col items-center z-10 pl-12 md:pl-0 relative">
                {/* Mobile line connector */}
                {index !== steps.length - 1 && (
                  <div className={`absolute left-[1.125rem] top-8 w-1 h-full md:hidden ${isCompleted ? 'bg-success' : 'bg-gray-200'}`}></div>
                )}
                {/* Desktop line connector */}
                {index !== 0 && (
                  <div className={`hidden md:block absolute right-1/2 top-4 w-full h-1 -z-10 ${isCompleted || isCurrent ? 'bg-success' : 'bg-gray-200'}`}></div>
                )}

                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 absolute md:relative left-0 md:left-auto top-0 md:top-auto
                  ${isCompleted ? 'bg-success border-success text-white' : ''}
                  ${isCurrent ? 'bg-white border-primary text-primary shadow-md' : ''}
                  ${isPending ? 'bg-white border-gray-300 text-gray-400' : ''}
                `}>
                  {isCompleted ? '✓' : index + 1}
                </div>
                <div className={`
                  md:mt-2 text-sm md:text-center md:w-24
                  ${isCurrent ? 'font-bold text-primary' : ''}
                  ${isCompleted ? 'font-medium text-text-primary' : ''}
                  ${isPending ? 'text-gray-400' : ''}
                `}>
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderStatusTracker;
