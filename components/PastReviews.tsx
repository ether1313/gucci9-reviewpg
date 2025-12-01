'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

// 初始化 Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Review {
  id?: number
  name: string
  rating: number
  games: string[]
  comment: string
  wallet: string
  created_at?: string
}

export default function PastReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [startIndex, setStartIndex] = useState(0)
  const [expandedIndex, setExpandedIndex] = useState<number | null | -1>(null)
  const [reviewCount, setReviewCount] = useState(102)
  const [avgRating, setAvgRating] = useState(4.6)
  const containerRef = useRef<HTMLDivElement>(null)

  // ========= 格式化函数 =========
  const formatReview = (r: any): Review => ({
    id: r.id,
    name: r.name,
    rating: r.rating,
    games: typeof r.games === 'string' ? r.games.split(',').map((g: string) => g.trim()) : r.games,
    comment: r.experiences || r.comment || '',
    wallet: r.casino_wallet || r.wallet || 'Gucci9',
    created_at: r.created_at,
  })

  // ========= 统一随机函数（全球一致）=========
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed * 9999.987) * 10000
    return x - Math.floor(x)
  }

  // ========= 是否周末（UTC）=========
  const isWeekend = (date: Date) => {
    const d = date.getUTCDay()
    return d === 0 || d === 6
  }

  // ========= 当前小时（UTC）=========
  const getHourUTC = (date: Date) => date.getUTCHours()

  // ========= 虚拟统计（永远递增 + 随机 + 行为模型）=========
  const updateVirtualStats = () => {
    const baseDate = new Date('2025-11-05T12:00:00Z')
    const now = new Date()

    const diffHours = Math.floor((now.getTime() - baseDate.getTime()) / 3600000)
    const fourHourBlock = Math.floor(diffHours / 4)

    let count = 102

    // ---- 累积每个 4 小时区块的增长 ----
    for (let i = 1; i <= fourHourBlock; i++) {
      const blockTime = new Date(baseDate.getTime() + i * 4 * 3600000)
      const hour = getHourUTC(blockTime)

      // 基础随机（固定随机：5–10）
      const raw = 5 + Math.floor(seededRandom(i) * 6)

      let multiplier = 1

      // 午夜慢：00–06
      if (hour >= 0 && hour < 6) multiplier = 0.5

      // 白天快：09–21
      else if (hour >= 9 && hour < 21) multiplier = 1.3

      // 周末整体加速
      if (isWeekend(blockTime)) multiplier *= 1.5

      // 最终增长数量（至少 1）
      const growth = Math.max(Math.floor(raw * multiplier), 1)

      count += growth
    }

    setReviewCount(count)

    // 平均星级
    const avg = 4.4 + seededRandom(fourHourBlock + 999) * 0.3
    setAvgRating(parseFloat(avg.toFixed(1)))
  }

  // ========= 初始化加载评论 + 虚拟统计 =========
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('gucci9_review')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)

        if (error) throw error
        if (data) setReviews(data.map(formatReview))
      } catch (err) {
        console.error('❌ Fetch reviews failed:', err)
      }
    }

    fetchReviews()
    updateVirtualStats()

    // 每 4 小时自动更新
    const interval = setInterval(updateVirtualStats, 4 * 60 * 60 * 1000)

    // ---- Supabase 实时监听新评论 ----
    const channel = supabase
      .channel('realtime:gucci9_review')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'gucci9_review' }, (payload) => {
        const newReview = formatReview(payload.new)
        setReviews((prev) => {
          const exists = prev.some((r) => r.name === newReview.name && r.comment === newReview.comment)
          if (exists) return prev
          return [newReview, ...prev].slice(0, 10)
        })
      })
      .subscribe()

    // ---- 本地 dispatchEvent 新评论 ----
    const handleNewReview = (e: CustomEvent) => {
      const newReview = e.detail
      setReviews((prev) => {
        const exists = prev.some((r) => r.name === newReview.name && r.comment === newReview.comment)
        if (exists) return prev
        return [newReview, ...prev].slice(0, 10)
      })
    }

    window.addEventListener('new-review', handleNewReview as EventListener)

    return () => {
      clearInterval(interval)
      supabase.removeChannel(channel)
      window.removeEventListener('new-review', handleNewReview as EventListener)
    }
  }, [])

  // ========= 滑动（桌面）=========
  const handlePrev = () => setStartIndex((prev) => Math.max(prev - 1, 0))
  const handleNext = () => setStartIndex((prev) => Math.min(prev + 1, reviews.length - 5))

  // ========= 滑动（移动端）=========
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let startX = 0
    let endX = 0

    const handleTouchStart = (e: TouchEvent) => (startX = e.touches[0].clientX)
    const handleTouchEnd = (e: TouchEvent) => {
      endX = e.changedTouches[0].clientX
      if (startX - endX > 50) handleNext()
      if (endX - startX > 50) handlePrev()
    }

    container.addEventListener('touchstart', handleTouchStart)
    container.addEventListener('touchend', handleTouchEnd)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  return (
    <section id="testimonial-section" className="pt-1 pb-10 sm:pt-2 sm:pb-12 px-4 relative bg-transparent">
      <div className="max-w-7xl mx-auto text-center relative">
        {/* ===== Header ===== */}
        <div className="flex flex-col items-center justify-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-4xl font-bold text-[#ecf3ff] mb-2 sm:mb-3">Testimonials</h2>
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill={i < Math.round(avgRating) ? '#facc15' : '#e5e7eb'} stroke="none" />
              ))}
              <span className="ml-1 font-semibold text-[#ecf3ff] text-sm sm:text-base">
                {avgRating.toFixed(1)}/5.0
              </span>
            </div>
            <span className="text-xs text-[#ecf3ff]">{reviewCount.toLocaleString()} reviews</span>
          </div>
        </div>

        {/* ===== Desktop Layout ===== */}
        <div className="relative hidden sm:flex items-center justify-start">
          <button
            onClick={handlePrev}
            className={`absolute -left-6 z-20 p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition ${
              startIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''
            }`}
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          <div ref={containerRef} className="w-full overflow-visible px-10">
            <div
              className="flex gap-6 transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${startIndex * 22}%)` }}
            >
              {reviews.map((review, index) => (
                <div key={review.id || index} className="relative min-w-[20%] max-w-[20%] flex-shrink-0">
                  {index === 0 && (
                    <span className="absolute -top-4 right-4 z-30 bg-gradient-to-r from-[#0E4738] to-[#D4AF37] text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-md animate-pulse">
                      Latest Review
                    </span>
                  )}
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleNext}
            className={`absolute -right-6 z-20 p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition ${
              startIndex >= reviews.length - 5 ? 'opacity-30 cursor-not-allowed' : ''
            }`}
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* ===== Mobile Layout ===== */}
        <div className="relative sm:hidden flex flex-col gap-4 transition-all duration-700 ease-in-out">
          <div
            className={`grid gap-4 transition-all duration-700 ease-in-out overflow-visible ${
              expandedIndex === -1 ? 'max-h-[4000px]' : 'max-h-[2000px]'
            }`}
          >
            {reviews.slice(0, expandedIndex === -1 ? 10 : 5).map((review, index) => (
              <div key={review.id || index} id={`review-${index + 1}`} className="relative transition-all duration-500">
                {index === 0 && (
                  <span className="absolute -top-3 right-4 z-30 bg-gradient-to-r from-indigo-400 to-blue-500 text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-md animate-pulse">
                    Latest Review
                  </span>
                )}
                <ReviewCard review={review} isMobile />
              </div>
            ))}
          </div>

          {reviews.length > 5 && (
            <button
              onClick={() => setExpandedIndex(expandedIndex === -1 ? null : -1)}
              className="mt-3 mx-auto text-sm font-semibold text-blue-600 bg-blue-50 px-5 py-2 rounded-full shadow-sm hover:bg-blue-100 transition-transform duration-500 active:scale-95"
            >
              {expandedIndex === -1 ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

// ================= Review Card =================
const ReviewCard = ({ review, isMobile = false }: { review: Review; isMobile?: boolean }) => {
  const getAvatarUrl = (name: string) =>
    `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name.trim())}&backgroundColor=transparent`

  return (
    <div
      className={`
        bg-white/10 backdrop-blur-md 
        border border-white/20 shadow-lg shadow-blue-500/10 
        rounded-3xl transition-all 
        ${isMobile ? 'p-4 h-auto' : 'p-6 h-[360px]'}
        flex flex-col justify-between text-left
        hover:shadow-blue-400/20 hover:scale-[1.02]
      `}
    >
      <div>
        {/* Header: Avatar + Name + Rating */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={getAvatarUrl(review.name)}
            alt={review.name}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/30 bg-white/10"
          />

          <div>
            <h3 className="font-semibold text-white text-sm sm:text-base drop-shadow-md">
              {review.name}
            </h3>

            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                    i < review.rating
                      ? 'fill-yellow-400 text-yellow-400 drop-shadow-md'
                      : 'text-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Game Tags */}
        <div className="flex flex-wrap gap-1.5 mb-2 sm:mb-3">
          {review.games?.map((game, i) => (
            <span
              key={i}
              className="text-[10px] sm:text-[11px] font-semibold 
              text-blue-200 bg-blue-900/30 px-2 py-0.5 rounded-full border border-blue-300/30"
            >
              {game}
            </span>
          ))}
        </div>

        {/* Comment */}
        <p className="text-white/80 text-sm mb-3 line-clamp-5 drop-shadow-md">
          "{review.comment}"
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/20 pt-3">
        <span className="text-xs text-white/60">Wallet:</span>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <img src="/australia-flag.png" alt="Flag" className="w-4 h-4 sm:w-5 sm:h-5" />
          <span
            className="text-[10px] sm:text-xs font-semibold 
            text-blue-100 bg-blue-900/30 px-2 py-0.5 rounded-full border border-blue-300/30"
          >
            {review.wallet}
          </span>
        </div>
      </div>
    </div>
  )
}

