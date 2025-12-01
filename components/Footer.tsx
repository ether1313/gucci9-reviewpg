import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="relative px-4 py-4 sm:py-5 overflow-hidden">

      {/* 背景柔和渐变，不抢戏 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0f1117]/40 to-[#0f1117]/80"></div>

      {/* 柔光点（压低尺寸避免太膨胀） */}
      <div className="absolute bottom-6 left-1/3 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 right-1/4 w-28 h-28 bg-purple-500/10 rounded-full blur-2xl"></div>

      <div className="relative max-w-5xl mx-auto">

        {/* 更薄的透明 HUD 卡片 */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-4 py-3 sm:px-6 sm:py-4 shadow-lg">

          <div className="border-t border-white/20 pt-3 flex justify-center">
            <p className="text-white/70 text-[12px] sm:text-[15px] font-['Orbitron'] tracking-wide">
              © 2025 Gucci9 Trusted Online Casino Wallet
            </p>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
