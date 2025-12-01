'use client';
import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const Authorize = () => {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // 使用滾動比例來控制縮放、位置與透明度
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [2.5, 1.3, 1, 2]); 
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [0.3, 1, 1, 0.5]);

  return (
    <section
      ref={ref}
      className="relative py-10 sm:py-20 overflow-hidden 
                bg-gradient-to-b from-[#121212]/95 via-[#171a24]/95 to-[#1d1f27]/98"
    >

      {/* 內容 */}
      <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
        <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-10 lg:mb-12 text-[#ecf3ff] text-center"
            >
            <span className="block sm:inline">Officially Recognized by TPA</span>{' '}
        </motion.h2>

        {/* 徽章 + 文字 */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 mt-2 px-4 lg:px-12">
        {/* 動態徽章 */}
        <motion.div
            style={{ scale, y, opacity }}
            className="relative flex flex-col items-center origin-center flex-shrink-0"
        >
            <div className="relative w-36 h-36 sm:w-40 sm:h-40 lg:w-48 lg:h-48">
            <Image
                src="/TPA-authorized-nb.png"
                alt="Trusted Pokies Australia Badge"
                fill
                className="object-contain drop-shadow-[0_0_25px_rgba(59,130,246,0.4)]"
            />
            </div>
            <p className="mt-2 text-xs sm:text-sm text-[#ecf3ff] font-medium text-center">
            Trusted Pokies Australia · 2025 Certification
            </p>
        </motion.div>

        {/* 描述文字 */}
        <motion.div
            initial={{ opacity: 0, x: 0 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
            viewport={{ once: false }}
            className="max-w-xl text-[#ecf3ff] text-sm sm:text-base leading-relaxed text-center lg:text-left mt-2 lg:mt-0"
        >
            <p className="mb-3">
            Gucci9 Australia Online Casino Wallet has been officially recognized and recommended by{' '}
            <span className="font-semibold text-[#0099ff]">Trusted Pokies Australia</span> for its
            commitment to transparency, security, and entertainment excellence.
            </p>
            <p className="text-[#ecf3ff] italic">
            "Play smart. Play secure. Play with Gucci9."
            </p>
        </motion.div>
        </div>

        {/* 信任提示 */}
        <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        viewport={{ once: false }}
        className="mt-14 sm:mt-18 flex flex-col sm:flex-row items-center justify-center gap-3 text-[#ecf3ff] text-center"
        >
        <ShieldCheck className="w-6 h-6 text-blue-600 mx-auto sm:mx-0" />
        <span className="text-sm sm:text-base font-medium">
            Verified & Endorsed by Trusted Pokies Australia
        </span>
        </motion.div>

      </div>
    </section>
  );
};

export default Authorize;
