'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';

// 動態引入 Testimonials（PastReviews）
const PastReviews = dynamic(() => import('@/components/PastReviews'), { ssr: false });

const HeroSection = () => {
  return (
    <section className="relative pt-12 sm:pt-14 md:pt-16 pb-6 flex flex-col items-center justify-center text-center overflow-hidden px-6">

      {/* 限制最大宽度 */}
      <div className="max-w-7xl mx-auto relative z-10">
        {/* 公司 Logo */}
        <div className="relative w-48 h-24 sm:w-64 sm:h-28 mb-2 
            rounded-2xl flex items-center justify-center overflow-hidden mx-auto">

        <Image
          src="/gucci9.png"
          alt="Company Logo"
          fill
          className="object-contain opacity-90"
        />
      </div>

        {/* Testimonials 區塊放在這裡 */}
        <div className="mt-2">
          <PastReviews />
        </div>

        {/* 滑鼠 Scroll Down 提示 */}
        <div className="scroll-indicator mt-10">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <p className="scroll-text mt-4 text-gray-500 text-sm tracking-wider">
            SCROLL DOWN
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
