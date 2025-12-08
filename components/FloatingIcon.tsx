'use client'

import Image from 'next/image'
import { X } from 'lucide-react'
import { useState } from 'react'

export default function FloatingIcon() {
  const [visible, setVisible] = useState(true)
  if (!visible) return null

  return (
    <div
      className="fixed bottom-24 left-4 z-50 flex flex-col items-center gap-1 
                 animate-float-fast cursor-pointer"
    >
      {/* Close Button */}
      <button
        onClick={() => setVisible(false)}
        className="absolute -top-2 -right-2 bg-black/70 text-white rounded-full p-1 hover:bg-black transition"
      >
        <X size={14} />
      </button>

      {/* Clickable Icon */}
      <a
        href="https://www.gucci9.vip/"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full transition-transform duration-200 hover:scale-110"
      >
        <Image
          src="/playnow-floatingicon.gif"
          alt="Spin & Win"
          width={70}
          height={70}
          className="sm:w-[80px] sm:h-[80px] md:w-[90px] md:h-[90px]" 
          priority
        />
      </a>
    </div>
  )
}