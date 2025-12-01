'use client'

import { useState, useEffect } from 'react'
import { Star, Send, ChevronDown, Search } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

// 初始化 Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ====== MultiSelectDropdown（透明 HUD 版本）======
interface DropdownProps {
  label: string
  options: { label: string; isGroup?: boolean }[]
  selected: string[]
  setSelected: React.Dispatch<React.SetStateAction<string[]>>
}

const MultiSelectDropdown = ({ label, options, selected, setSelected }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.dropdown-container')) setIsOpen(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const filteredOptions = options.filter(
    (opt) => opt.isGroup || opt.label.toLowerCase().includes(search.toLowerCase())
  )

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      setSelected(selected.filter((item) => item !== option))
    } else {
      if (selected.length >= 3) {
        alert(`⚠️ You can select up to 3 ${label.toLowerCase()} only.`)
        return
      }
      setSelected([...selected, option])
    }
  }

  const placeholderText =
    selected.length > 0
      ? selected.join(', ')
      : label === 'Games'
      ? 'Select up to 3 games'
      : label === 'Your Experience'
      ? 'Select up to 3 experiences'
      : `Select ${label}`

  return (
    <div className="relative dropdown-container">
      <label className="block text-sm font-medium text-gray-200 mb-2">{label}</label>

      {/* === Dropdown Button === */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="
          w-full flex justify-between items-center px-4 py-3
          bg-white/10 border border-white/20 rounded-xl 
          backdrop-blur-sm 
          text-gray-200 placeholder-gray-400
          hover:bg-white/20 transition-all duration-200
        "
      >
        <span className={`truncate ${selected.length === 0 ? 'text-gray-400' : 'text-gray-100'}`}>
          {placeholderText}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-300 transform transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* === Dropdown Menu === */}
      {isOpen && (
        <div
          className="
            absolute z-20 mt-2 w-full 
            bg-[#1d1f23] 
            rounded-xl shadow-xl 
            border border-white/20 
            max-h-64 overflow-y-auto
          "
        >
          {/* Search bar */}
          <div className="flex items-center px-3 py-2 border-b border-white/10 bg-white/5 sticky top-0 z-10 backdrop-blur-md">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder={`Search ${label}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm text-gray-200 bg-transparent outline-none placeholder-gray-400"
            />
          </div>

          {/* Options */}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) =>
              opt.isGroup ? (
                <div
                  key={opt.label}
                  className="px-4 py-2 text-xs uppercase font-semibold text-blue-200 bg-white/5 border-t border-white/10"
                >
                  {opt.label}
                </div>
              ) : (
                <div
                  key={opt.label}
                  onClick={() => toggleOption(opt.label)}
                  className={`
                    px-4 py-2 text-sm cursor-pointer flex items-center justify-between
                    transition-all
                    ${
                      selected.includes(opt.label)
                        ? 'bg-blue-500/30 text-blue-100 border-l-2 border-blue-300'
                        : 'text-gray-200 hover:bg-white/10'
                    }
                  `}
                >
                  {opt.label}
                  {selected.includes(opt.label) && <span className="text-blue-300 text-xs">✓</span>}
                </div>
              )
            )
          ) : (
            <p className="text-gray-400 text-sm p-3 text-center">No results found</p>
          )}
        </div>
      )}
    </div>
  )
}

// ====== 主表单（透明 HUD）======
const ReviewForm = () => {
  const [name, setName] = useState('')
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [selectedGames, setSelectedGames] = useState<string[]>([])
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([])
  const [others, setOthers] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('')

  const liveGames = ['Big Gaming','CT855','Pragmatic Play','Playtech','Sexy Baccarat','Yeebet']

  const slotGames = [
    'A1 [IMPERIUM]','ACE333','ADVP [AdvantPlay]','AFBSLOT','AESG ALL GAME','AESG-1 [PragmaticPlay]',
    'AESG-3 [PGSoft]','AESG-5 [Playson]','AESG-7 [Habanero]','APO [APOLLO]','AWC-12 [YL FISHING]',
    'AWC-16 [FACHAI]','AWC-17 [FASTSPIN]','AWC-20 [PLAYTECH-SLOT]','AWC-3 HORSEBOOK','AWC-3 KING MAKER',
    'AWC-3 SV388','BNG [BOOONGO]','BNG2','BP [BIGPOT]','BT [BT Gaming]','CG [CREATIVE GAMING]','CLOTPLAY',
    'CQ-1 [CQ9 SLOT]','CROWDPLAY','CT','DGS [DRAGOONSOFT]','EPICWIN','EVO888H5','FC [FACHAI]',
    'GMSDG [DREAM GAMING]','GMSL1 [LIVE22]','HBNR [HABANERO]','IBEX','ILOVEU','JDB-1 [JDB-SLOT]',
    'JDB2-3 [SPRIBE]','JILI','JILI 1:1','JILI 1:100','JOKER','KAYA918','KING888H5 [888KING-H5]',
    'KISS918','LFC','MACROSS [ACEWIN]','M8','MARIO','MEGA-1 [MEGA888-SLOT]','MG888H5 [MEGA888H5]',
    'NS [Nextspin]','PEGS [PEGASUS]','PGS','PLAYSTAR','PP-1 [PragmaticPlay Slot]','PUSSY','RG [RichGaming]',
    'RICH88','SCRATCH','SLOTMANIA [VPLUS]','SPADE','UUS [UU Slot]','VP','VP2','WF','WIN38','WOW [WOWGAMING]',
    'XE88','YBG [YellowBet]','YGR'
  ]

  const experiences = [
    "High volatility slot excitement",
    "Rapid bonus trigger frequency",
    "Smooth in-game animation quality",
    "Optimized wagering flow",
    "Transparent payout calculation",
    "Real-time rebate progression",
    "Stable connection during live tables",
    "Dynamic jackpot accumulation",
    "Efficient bet-to-payout ratio",
    "24/7 responsive player support"
  ]

  const allGames = [
    { label: 'Live Games', isGroup: true },
    ...liveGames.map((g) => ({ label: g })),
    { label: 'Slot Games', isGroup: true },
    ...slotGames.map((g) => ({ label: g })),
  ]

  const allExperiences = experiences.map((e) => ({ label: e }))

  // ========== Submit ==========
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return alert('⚠️ Please enter your name.')
    if (selectedGames.length === 0) return alert('⚠️ Select at least one game.')
    if (selectedExperiences.length === 0) return alert('⚠️ Select at least one experience.')
    if (rating === 0) return alert('⚠️ Please select your star rating.')

    setIsSubmitting(true)
    setSubmitStatus('')

    try {
      const { error } = await supabase.from('gucci9_review').insert([
        {
          name,
          casino_wallet: 'Gucci9',
          games: selectedGames.join(', '),
          experiences: selectedExperiences.join(', '),
          rating,
          others,
        },
      ])

      if (error) throw error

      window.dispatchEvent(
        new CustomEvent('new-review', {
          detail: {
            name,
            rating,
            games: selectedGames,
            comment: selectedExperiences.join(', '),
            wallet: 'Gucci9',
            created_at: new Date().toISOString(),
          },
        })
      )

      setSubmitStatus('✅ Thank you! Your review has been submitted.')
      setName('')
      setRating(0)
      setSelectedGames([])
      setSelectedExperiences([])
      setOthers('')
      setTimeout(() => setSubmitStatus(''), 3000)
    } catch (err) {
      console.error(err)
      setSubmitStatus('❌ Something went wrong.')
      setTimeout(() => setSubmitStatus(''), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="review-form" className="py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* ===== 玻璃容器 ===== */}
        <div className="relative overflow-hidden rounded-3xl
          bg-white/10 backdrop-blur-xl border border-white/20
          shadow-2xl p-8">

          {/* 标题 */}
          <h2
            className="
              font-bold text-center mb-8
              text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white
              text-xl sm:text-2xl md:text-3xl lg:text-4xl
              leading-tight
            "
          >
            Share Your Gaming Experience
          </h2>


          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl 
                  bg-white/10 border border-white/20 text-white
                  placeholder-white/40 backdrop-blur-md 
                  focus:border-blue-400 focus:outline-none"
                placeholder="Your name"
              />
            </div>

            {/* Casino Wallet */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Casino Wallet
              </label>
              <input
                type="text"
                value="Gucci9"
                readOnly
                className="w-full px-4 py-3 rounded-xl 
                  bg-white/5 border border-white/20 text-white/60
                  cursor-not-allowed"
              />
            </div>

            {/* Dropdowns */}
            <MultiSelectDropdown
              label="Games"
              options={allGames}
              selected={selectedGames}
              setSelected={setSelectedGames}
            />

            <MultiSelectDropdown
              label="Your Experience"
              options={allExperiences}
              selected={selectedExperiences}
              setSelected={setSelectedExperiences}
            />

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Star Rating
              </label>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    onMouseEnter={() => setHoveredRating(s)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition hover:scale-110 p-1"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        s <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-white/40'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Others */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Others (Optional)
              </label>
              <textarea
                value={others}
                onChange={(e) => setOthers(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl 
                bg-white/10 border border-white/20 text-white
                placeholder-white/40 backdrop-blur-md
                focus:border-blue-400 focus:outline-none resize-none"
                placeholder="Share more about your experience..."
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 
              text-white font-semibold rounded-xl hover:scale-105 
              transition disabled:opacity-50"
            >
              <div className="flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </div>
            </button>

            {/* Status */}
            {submitStatus && (
              <div
                className={`text-center mt-3 p-3 rounded-lg text-sm ${
                  submitStatus.includes('Thank')
                    ? 'bg-green-500/20 text-green-300 border border-green-500/40'
                    : 'bg-red-500/20 text-red-300 border border-red-500/40'
                }`}
              >
                {submitStatus}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}

export default ReviewForm
