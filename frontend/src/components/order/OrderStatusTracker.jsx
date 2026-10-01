import React from 'react';
import { 
  HiOutlineClipboardDocumentCheck, 
  HiOutlineHandThumbUp, 
  HiOutlineCreditCard, 
  HiOutlineCheckBadge, 
  HiOutlineFire, 
  HiOutlineTruck, 
  HiOutlineCheckCircle,
  HiOutlineXCircle
} from 'react-icons/hi2';

const OrderStatusTracker = ({ currentStatus }) => {
  const steps = [
    { 
      id: 'pending', 
      label: 'Placed', 
      description: 'Order received',
      icon: HiOutlineClipboardDocumentCheck 
    },
    { 
      id: 'accepted', 
      label: 'Accepted', 
      description: 'Accepted by shop',
      icon: HiOutlineHandThumbUp 
    },
    { 
      id: 'payment_verified', 
      label: 'Payment Verified', 
      description: 'UPI verified',
      icon: HiOutlineCreditCard 
    },
    { 
      id: 'confirmed', 
      label: 'Confirmed', 
      description: 'Order scheduled',
      icon: HiOutlineCheckBadge 
    },
    { 
      id: 'preparing', 
      label: 'Preparing', 
      description: 'Fresh sweets in kitchen',
      icon: HiOutlineFire 
    },
    { 
      id: 'ready', 
      label: 'Ready / Out for Delivery', 
      description: 'Packed & ready',
      icon: HiOutlineTruck 
    },
    { 
      id: 'completed', 
      label: 'Completed', 
      description: 'Fulfilled & enjoyed',
      icon: HiOutlineCheckCircle 
    }
  ];

  // Handle cancelled or rejected
  if (currentStatus === 'rejected' || currentStatus === 'cancelled') {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center space-x-3">
        <HiOutlineXCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
        <div>
          <h4 className="font-bold text-base capitalize">Order {currentStatus}</h4>
          <p className="text-sm text-red-700">
            {currentStatus === 'rejected' 
              ? 'This order could not be fulfilled by the restaurant.' 
              : 'This order was cancelled.'}
          </p>
        </div>
      </div>
    );
  }

  // Calculate current active step index
  let currentIndex = steps.findIndex(s => s.id === currentStatus);
  if (currentStatus === 'out_for_delivery') {
    currentIndex = steps.findIndex(s => s.id === 'ready');
  }
  if (currentIndex === -1) {
    currentIndex = 0;
  }

  return (
    <div className="w-full">
      {/* ================= DESKTOP STEPPER (md and above) ================= */}
      <div className="hidden md:block">
        <div className="grid grid-cols-7 gap-0 relative">
          {steps.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isPending = index > currentIndex;
            const Icon = step.icon;

            return (
              <div key={step.id} className="relative flex flex-col items-center group">
                {/* Horizontal Connector Line Left */}
                {index > 0 && (
                  <div
                    className={`absolute top-5 right-1/2 w-full h-[3px] -translate-y-1/2 transition-colors duration-300 ${
                      index <= currentIndex ? 'bg-[#9B2335]' : 'bg-gray-200'
                    }`}
                  />
                )}

                {/* Horizontal Connector Line Right */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-5 left-1/2 w-full h-[3px] -translate-y-1/2 transition-colors duration-300 ${
                      index < currentIndex ? 'bg-[#9B2335]' : 'bg-gray-200'
                    }`}
                  />
                )}

                {/* Step Circle Indicator */}
                <div
                  className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? 'bg-[#9B2335] text-white shadow'
                      : isCurrent
                      ? 'bg-white text-[#9B2335] border-2 border-[#9B2335] ring-4 ring-[#9B2335]/20 shadow-md scale-110'
                      : 'bg-white text-gray-400 border-2 border-gray-200'
                  }`}
                >
                  {isCompleted ? (
                    <span className="font-bold text-sm">✓</span>
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>

                {/* Step Label & Subtext */}
                <div className="text-center mt-3 px-1 w-full">
                  <p
                    className={`text-xs font-bold leading-tight ${
                      isCurrent
                        ? 'text-[#9B2335]'
                        : isCompleted
                        ? 'text-[#2C1810]'
                        : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-snug line-clamp-1">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= MOBILE STEPPER (Vertical Timeline) ================= */}
      <div className="md:hidden space-y-0 relative pl-2">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;
          const isLast = index === steps.length - 1;
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative flex items-start pb-6 last:pb-0">
              {/* Vertical Connector Line */}
              {!isLast && (
                <div
                  className={`absolute left-[17px] top-8 bottom-0 w-[2px] -translate-x-1/2 transition-colors duration-300 ${
                    index < currentIndex ? 'bg-[#9B2335]' : 'bg-gray-200'
                  }`}
                />
              )}

              {/* Step Circle Indicator */}
              <div
                className={`relative z-10 w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? 'bg-[#9B2335] text-white shadow'
                    : isCurrent
                    ? 'bg-white text-[#9B2335] border-2 border-[#9B2335] ring-4 ring-[#9B2335]/20 shadow-md'
                    : 'bg-white text-gray-400 border-2 border-gray-200'
                }`}
              >
                {isCompleted ? (
                  <span className="font-bold text-sm">✓</span>
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              {/* Step Text Info */}
              <div className="ml-3.5 pt-1 flex-1">
                <div className="flex items-center justify-between">
                  <p
                    className={`text-sm font-semibold leading-tight ${
                      isCurrent
                        ? 'text-[#9B2335] font-bold'
                        : isCompleted
                        ? 'text-[#2C1810]'
                        : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </p>
                  {isCurrent && (
                    <span className="text-[10px] bg-[#9B2335]/10 text-[#9B2335] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusTracker;
