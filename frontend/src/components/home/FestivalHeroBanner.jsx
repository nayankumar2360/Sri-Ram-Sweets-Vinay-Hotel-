import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiCalendarDays, HiSparkles, HiClock, HiCheckCircle, HiExclamationTriangle, HiLockClosed } from 'react-icons/hi2';

const FestivalHeroBanner = ({ festival }) => {
  const [imageError, setImageError] = useState(false);

  if (!festival || !festival.banner || festival.banner.enabled === false) {
    return null;
  }

  const {
    name,
    slug,
    banner = {},
    preorderStatus,
    festivalStatus,
    isOrderingAllowed,
    statusReason,
    openTime,
    closeDeadline,
    startDate,
    endDate,
    importantDays = []
  } = festival;

  const headline = banner.headline || `Celebrate ${name} with Authentic Sweets`;
  const subtitle = banner.subtitle || `Handcrafted traditional delicacies and pure ghee sweets from Sri Ram Sweets.`;
  const ctaText = banner.ctaText || 'Pre-Order Festival Specials';
  const ctaLink = `/pre-order?festival=${encodeURIComponent(slug || name)}`;

  // Find if today matches an important ritual day (Nahay Khay, Kharna, etc.)
  const todayStr = new Date().toISOString().split('T')[0];
  const activeRitual = importantDays.find(day => {
    if (!day.date) return false;
    return new Date(day.date).toISOString().split('T')[0] === todayStr;
  });

  const formattedStart = startDate 
    ? new Date(startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';
  const formattedOpen = openTime 
    ? new Date(openTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  const desktopImg = banner.desktopImage || banner.mobileImage;
  const mobileImg = banner.mobileImage || banner.desktopImage;
  const opacity = banner.overlayOpacity ?? 0.45;

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#7A1B29] via-[#9B2335] to-[#E8742A] text-white">
      {/* Background Banner Image with graceful fallback */}
      {!imageError && desktopImg && (
        <div className="absolute inset-0 z-0">
          <picture>
            {mobileImg && <source media="(max-width: 640px)" srcSet={mobileImg} />}
            <img
              src={desktopImg}
              alt={name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
              style={{ objectPosition: banner.focalPoint || 'center' }}
            />
          </picture>
        </div>
      )}

      {/* Dynamic Overlay for readability */}
      <div 
        className="absolute inset-0 z-0 transition-opacity bg-gradient-to-r from-[#2C1810]/90 via-[#2C1810]/75 to-[#7A1B29]/70"
        style={{ opacity: Math.max(0.4, opacity) }}
      />

      {/* Decorative Traditional Border Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4A017] via-[#F0D060] to-[#D4A017] z-10" />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-3xl">
          {/* Status & Ritual Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#D4A017] text-[#2C1810] shadow-sm">
              <HiSparkles className="w-3.5 h-3.5" />
              {festival.region || 'Bihar'} Festival Special
            </span>

            {activeRitual && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-amber-950 animate-pulse">
                🌟 Today: {activeRitual.title}
              </span>
            )}

            {festivalStatus === 'ongoing' && !activeRitual && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500 text-white">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                Festival Ongoing
              </span>
            )}

            {preorderStatus === 'open' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600/90 text-white border border-emerald-400/30">
                <HiCheckCircle className="w-3.5 h-3.5" />
                Pre-Orders Open
              </span>
            )}

            {preorderStatus === 'not_yet_open' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/90 text-white">
                <HiClock className="w-3.5 h-3.5" />
                Pre-Orders Open on {formattedOpen}
              </span>
            )}

            {preorderStatus === 'temporarily_closed' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-600 text-white">
                <HiLockClosed className="w-3.5 h-3.5" />
                Pre-Orders Temporarily Paused
              </span>
            )}

            {preorderStatus === 'sold_out' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-rose-600 text-white">
                <HiExclamationTriangle className="w-3.5 h-3.5" />
                Capacity Reached / Sold Out
              </span>
            )}

            {preorderStatus === 'deadline_passed' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-200">
                Pre-Order Deadline Passed
              </span>
            )}
          </div>

          {/* Headline & Subtitle */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif tracking-tight text-white mb-3 drop-shadow-md">
            {headline}
          </h1>

          <p className="text-base sm:text-lg text-cream/90 max-w-2xl mb-6 font-normal leading-relaxed drop-shadow">
            {subtitle}
          </p>

          {/* Important Rituals Strip if available */}
          {importantDays && importantDays.length > 0 && (
            <div className="mb-6 p-3 sm:p-4 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10 max-w-2xl">
              <p className="text-xs font-semibold text-[#F0D060] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <HiCalendarDays className="w-4 h-4" />
                Key Celebration Days
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                {importantDays.map((d, i) => {
                  const dayDate = d.date ? new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '';
                  const isCurrent = d.date && new Date(d.date).toISOString().split('T')[0] === todayStr;
                  return (
                    <span 
                      key={i} 
                      className={`px-2.5 py-1 rounded-md transition ${
                        isCurrent 
                          ? 'bg-[#D4A017] text-[#2C1810] font-bold shadow' 
                          : 'bg-white/15 text-white/90'
                      }`}
                    >
                      <strong>{d.title}</strong>: {dayDate}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            {isOrderingAllowed ? (
              <Link
                to={ctaLink}
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg text-sm sm:text-base font-bold bg-[#D4A017] text-[#2C1810] hover:bg-[#F0D060] shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {ctaText} →
              </Link>
            ) : preorderStatus === 'not_yet_open' ? (
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold bg-white/20 text-cream backdrop-blur-sm border border-white/20">
                <HiClock className="w-5 h-5 text-[#F0D060]" />
                <span>Pre-Orders Open on {formattedOpen}</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-semibold bg-black/40 text-cream/90 backdrop-blur-sm border border-white/10">
                <span>{statusReason || 'Pre-Orders Currently Unavailable'}</span>
              </div>
            )}

            <Link
              to="/menu"
              className="inline-flex items-center justify-center px-5 py-3.5 rounded-lg text-sm sm:text-base font-medium bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 transition-colors"
            >
              Browse Full Menu
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Pattern Strip */}
      <div className="h-2 bg-gradient-to-r from-[#D4A017] via-[#9B2335] to-[#D4A017] opacity-80" />
    </section>
  );
};

export default FestivalHeroBanner;
