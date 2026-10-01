import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { HiPrinter, HiArrowLeft, HiSparkles, HiCheckCircle } from 'react-icons/hi2';
import { Link } from 'react-router-dom';

const PosterPage = () => {
  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://shrirammisthan.com';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] py-8 px-4 flex flex-col items-center">
      {/* Top Bar (Hidden in Print) */}
      <div className="w-full max-w-2xl mb-6 flex justify-between items-center print:hidden">
        <Link 
          to="/" 
          className="inline-flex items-center text-[#9B2335] hover:text-[#7A1B29] font-medium text-sm"
        >
          <HiArrowLeft className="mr-1 w-4 h-4" /> Back to Home
        </Link>
        <button
          onClick={handlePrint}
          className="inline-flex items-center bg-[#9B2335] text-white px-5 py-2.5 rounded-lg hover:bg-[#7A1B29] font-medium text-sm shadow-md transition-all"
        >
          <HiPrinter className="mr-2 w-5 h-5" /> Print A4 Restaurant Poster
        </button>
      </div>

      {/* Printable A4 Poster Frame */}
      <div className="w-full max-w-xl bg-white border-4 border-[#9B2335] rounded-3xl p-8 shadow-2xl relative overflow-hidden print:border-8 print:shadow-none print:w-[210mm] print:h-[297mm] print:m-0 print:p-10 print:rounded-none">
        {/* Decorative Traditional Corner Motifs */}
        <div className="absolute top-2 left-2 text-2xl text-[#D4A017] select-none">❖</div>
        <div className="absolute top-2 right-2 text-2xl text-[#D4A017] select-none">❖</div>
        <div className="absolute bottom-2 left-2 text-2xl text-[#D4A017] select-none">❖</div>
        <div className="absolute bottom-2 right-2 text-2xl text-[#D4A017] select-none">❖</div>

        {/* Header */}
        <div className="text-center pt-2 pb-4 border-b-2 border-[#E8DDD4]">
          <div className="inline-flex items-center justify-center space-x-1 text-[#D4A017] font-semibold text-xs tracking-widest uppercase mb-1">
            <HiSparkles className="w-4 h-4" />
            <span>Pure Desi Ghee & Fresh Traditional Sweets</span>
            <HiSparkles className="w-4 h-4" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#9B2335] tracking-tight">
            Sri Ram Sweets(Vinay Hotel)
          </h1>
          <p className="text-sm font-semibold text-[#6B4F3A] mt-1">
            Your Trusted Local Taste • Now Online
          </p>
        </div>

        {/* Main CTA */}
        <div className="text-center my-6">
          <div className="inline-block bg-[#9B2335] text-[#FFF9F0] px-6 py-2 rounded-full font-bold text-sm tracking-wide uppercase shadow">
            Now Order Directly From Us
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2C1810] mt-3">
            Skip the 3rd-Party Middlemen!
          </h2>
          <p className="text-xs text-[#6B4F3A] max-w-md mx-auto mt-1">
            Order fresh mithai, snacks, and namkeen straight from the shop kitchen. Best prices guaranteed!
          </p>
        </div>

        {/* QR Code Section */}
        <div className="bg-[#FFF9F0] border-2 border-dashed border-[#D4A017] rounded-2xl p-6 text-center my-6 flex flex-col items-center justify-center">
          <div className="bg-white p-4 rounded-xl shadow-md border border-[#E8DDD4] mb-3">
            <QRCodeSVG 
              value={currentUrl} 
              size={180} 
              level="H" 
              includeMargin={true}
            />
          </div>
          <p className="font-extrabold text-[#9B2335] text-lg tracking-wider uppercase">
            Scan to Order Online
          </p>
          <p className="text-xs text-[#6B4F3A] font-mono mt-0.5">
            {currentUrl}
          </p>
        </div>

        {/* 4 Steps */}
        <div className="grid grid-cols-4 gap-2 text-center my-4 py-3 bg-[#FAF5EE] rounded-xl border border-[#E8DDD4]">
          <div>
            <div className="w-7 h-7 mx-auto rounded-full bg-[#9B2335] text-white flex items-center justify-center text-xs font-bold mb-1">1</div>
            <p className="text-[11px] font-bold text-[#2C1810]">Scan</p>
          </div>
          <div>
            <div className="w-7 h-7 mx-auto rounded-full bg-[#9B2335] text-white flex items-center justify-center text-xs font-bold mb-1">2</div>
            <p className="text-[11px] font-bold text-[#2C1810]">Order</p>
          </div>
          <div>
            <div className="w-7 h-7 mx-auto rounded-full bg-[#9B2335] text-white flex items-center justify-center text-xs font-bold mb-1">3</div>
            <p className="text-[11px] font-bold text-[#2C1810]">Pay UPI</p>
          </div>
          <div>
            <div className="w-7 h-7 mx-auto rounded-full bg-[#9B2335] text-white flex items-center justify-center text-xs font-bold mb-1">4</div>
            <p className="text-[11px] font-bold text-[#2C1810]">Receive</p>
          </div>
        </div>

        {/* Festival & Bulk Highlights */}
        <div className="mt-4 pt-3 border-t border-[#E8DDD4] space-y-2">
          <div className="flex items-center text-xs text-[#2C1810]">
            <HiCheckCircle className="text-[#15803D] w-4 h-4 mr-2 shrink-0" />
            <span className="font-semibold text-[#9B2335]">Festival Pre-Orders:</span>
            <span className="ml-1 text-[#6B4F3A]">Diwali, Holi, Dussehra, Chhath special sweets booked in advance</span>
          </div>
          <div className="flex items-center text-xs text-[#2C1810]">
            <HiCheckCircle className="text-[#15803D] w-4 h-4 mr-2 shrink-0" />
            <span className="font-semibold text-[#9B2335]">Bulk & Event Orders:</span>
            <span className="ml-1 text-[#6B4F3A]">Weddings, birthday parties, school/office functions catered with care</span>
          </div>
          <div className="flex items-center text-xs text-[#2C1810]">
            <HiCheckCircle className="text-[#15803D] w-4 h-4 mr-2 shrink-0" />
            <span className="font-semibold text-[#9B2335]">Pickup or Delivery:</span>
            <span className="ml-1 text-[#6B4F3A]">Express counter pickup or door-step delivery at your convenience</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-6 pt-3 border-t border-[#E8DDD4] text-[11px] text-[#6B4F3A]">
          <p className="font-semibold text-[#2C1810]">Sri Ram Sweets(Vinay Hotel)</p>
          <p>📍 Q2VC+MV6, Hdfc Bank Road, Manpur, Bihar 823003</p>
          <p>Direct Order Support: 8292734852 • UPI Payment Accepted Directly</p>
        </div>
      </div>
    </div>
  );
};

export default PosterPage;
