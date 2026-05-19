import React, { useState, useEffect } from 'react'
import RegisterModal from '../components/modal/RegisterModal'
import LoginModal from '../components/modal/LoginModal'
import ccsLogo from '../uploads/download.png'


export default function Landing() {
  const [showRegister, setShowRegister] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [isDark, setIsDark] = useState(() => localStorage.getItem('isDark') === 'true')
  const [backendData, setBackendData] = useState(null);

  useEffect(() => {
    localStorage.setItem('isDark', isDark)
  }, [isDark])

  useEffect(() => {
    fetch('http://localhost:8080/api/api.php')
      .then((response) => response.json())
      .then((data) => {
        console.log("Data from PHP:", data);
        setBackendData(data);
      })
      .catch((error) => console.error("Error connecting to PHP:", error));
  }, []);

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-300 ${isDark ? 'bg-[#0f0520]' : 'bg-white'}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes shimmer { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* HEADER */}
      <header className={`fixed top-0 left-0 w-full z-50 backdrop-blur-md border-b transition-colors duration-300 ${
        isDark ? 'bg-[#0f051e]/80 border-white/10' : 'bg-white/80 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className={`font-serif text-2xl font-bold ${isDark ? 'text-white' : 'text-[#4a0080]'}`}>
            CCS <span className={isDark ? 'text-[#c89b2a]' : 'text-[#7c1fa0]'}>SIT-SIT</span>
          </div>

          <nav className="flex items-center gap-6 lg:gap-8">
            <a className={`font-semibold cursor-pointer text-sm transition-colors ${isDark ? 'text-purple-200/70 hover:text-[#c89b2a]' : 'text-slate-600 hover:text-[#7c1fa0]'}`}>Home</a>

            <div className="group relative py-4 -my-4">
              <a className={`font-semibold cursor-pointer text-sm transition-colors ${isDark ? 'text-purple-200/70 hover:text-[#c89b2a]' : 'text-slate-600 hover:text-[#7c1fa0]'}`}>Community ▾</a>
              <div className={`absolute top-full left-0 w-40 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border backdrop-blur-md ${isDark ? 'bg-[#1e0838]/90 border-[#c89b2a]/20' : 'bg-white/90 border-slate-200'}`}>
                {['Forums', 'Events', 'Members'].map(item => (
                  <div key={item} className={`px-4 py-2 text-sm font-medium cursor-pointer transition-colors ${isDark ? 'text-purple-200/70 hover:text-[#7c1fa0] hover:bg-[#2d0f4d]/50' : 'text-slate-600 hover:text-[#7c1fa0] hover:bg-slate-50/50'}`}>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <a className={`font-semibold cursor-pointer text-sm transition-colors ${isDark ? 'text-purple-200/70 hover:text-[#c89b2a]' : 'text-slate-600 hover:text-[#7c1fa0]'}`}>About</a>
            <a onClick={() => setShowLogin(true)} className={`font-semibold cursor-pointer text-sm transition-colors ${isDark ? 'text-purple-200/70 hover:text-[#c89b2a]' : 'text-slate-600 hover:text-[#7c1fa0]'}`}>Log in</a>

            <button onClick={() => setShowRegister(true)} className={`text-white font-bold px-6 py-2.5 rounded-full text-sm shadow-md hover:scale-105 active:scale-95 transition-all ${isDark ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#7c1fa0] hover:bg-purple-800'}`}>
              Register
            </button>

            <button onClick={() => setIsDark(!isDark)} className={`text-xl p-2 rounded-full transition-all duration-200 ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'}`} title="Toggle Theme">
              {isDark ? '☀️' : '🌙'}
            </button>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center px-12 lg:px-20 py-12 gap-12 lg:gap-20 relative overflow-hidden pt-24">
        <div className="w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-between px-12 lg:px-20 py-12 gap-12 lg:gap-20">
          {/* Background Blobs */}
          <div className={`absolute top-[10%] left-[5%] w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none ${isDark ? 'bg-[#7c1fa0]/30' : 'bg-[#7c1fa0]/10'}`} />
          <div className={`absolute bottom-[10%] right-[5%] w-[350px] h-[350px] rounded-full blur-[100px] pointer-events-none ${isDark ? 'bg-[#c89b2a]/20' : 'bg-[#c89b2a]/10'}`} />

          {/* Left Content */}
          <div className="flex-1 z-10" style={{ animation: 'fadeUp 0.8s ease forwards' }}>
            <div className={`inline-block border rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase mb-6 ${isDark ? 'bg-[#c89b2a]/10 border-[#c89b2a]/30 text-[#c89b2a]' : 'bg-[#f3e8ff] border-[#e9d5ff] text-[#7c1fa0]'}`}>
              UC · College of Computer Studies
            </div>

            <h1 className="font-serif text-[clamp(5rem,10vw,9rem)] font-black leading-none bg-[length:200%_auto] bg-clip-text text-transparent mb-7" style={{ animation: 'shimmer 4s linear infinite', backgroundImage: isDark ? 'linear-gradient(to right, #c89b2a, #e2c97e, #c89b2a)' : 'linear-gradient(to right, #7c1fa0, #c89b2a, #7c1fa0)' }}>
              SIT-SIT
            </h1>

            <p className={`text-lg leading-relaxed max-w-md mb-9 font-medium ${isDark ? 'text-purple-200/70' : 'text-slate-600'}`}>
              A modern, streamlined sit-in management system designed to make tracking computer lab sessions effortless. Log in, claim your seat, and get to work.
            </p>

            <div className="flex gap-4">
              <button onClick={() => setShowRegister(true)} className={`text-white font-bold px-8 py-3.5 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all ${isDark ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#7c1fa0] hover:bg-purple-800'}`}>
                Get Started
              </button>
              <button className={`p-0.5 rounded-full font-bold group transition-all duration-200 ${isDark ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#7c1fa0] hover:bg-purple-800'}`}>
                <div className={`px-7 py-3 rounded-full text-slate-600 transition-colors ${isDark ? 'bg-[#0f0520] group-hover:bg-[#1a0830] text-[#e2c97e]' : 'bg-white group-hover:bg-slate-50 text-[#7c1fa0]'}`}>
                  Learn More
                </div>
              </button>
            </div>
          </div>

          {/* Right Content (Logo) */}
          <div className="flex-1 flex justify-center items-center z-10" style={{ animation: 'float 5s ease-in-out infinite' }}>
            <div className="relative w-72 h-72 lg:w-80 lg:h-80">
              <div className={`absolute -inset-6 rounded-full blur-2xl transition-opacity duration-300 ${isDark ? 'bg-gradient-to-tr from-[#7c1fa0] to-[#c89b2a] opacity-50' : 'bg-gradient-to-tr from-[#7c1fa0] to-[#c89b2a] opacity-20'}`} />
              <div className={`absolute -inset-1 rounded-full p-1 ${isDark ? 'bg-amber-600' : 'bg-[#7c1fa0]'}`}>
                <div className={`w-full h-full rounded-full transition-colors duration-300 ${isDark ? 'bg-[#0f0520]' : 'bg-white'}`} />
              </div>
              <img src={ccsLogo} alt="CCS Logo" className="relative w-full h-full object-contain rounded-full z-10" />
            </div>
          </div>
        </div>
      </main>

      {/* LEADERBOARD SECTION */}
      <LeaderboardSection isDark={isDark} />

      {/* FOOTER */}
      <footer className={`mt-auto py-8 border-t transition-colors duration-300 z-10 relative w-full ${isDark ? 'bg-[#0a0314] border-[#c89b2a]/20 text-purple-200/50' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 w-full">
          <div className="flex items-center gap-2">
            <span className={`font-bold ${isDark ? 'text-[#e2c97e]' : 'text-[#7c1fa0]'}`}>CCS Sit-in System</span>
            <span className="text-sm">© {new Date().getFullYear()}</span>
          </div>
          <div className="text-xs font-medium tracking-wide text-center">
            University of Cebu · College of Computer Studies
          </div>
          <div className="flex gap-6 text-sm font-medium">
            <a className={`cursor-pointer transition-colors ${isDark ? 'hover:text-[#c89b2a]' : 'hover:text-[#7c1fa0]'}`}>Privacy Policy</a>
            <a className={`cursor-pointer transition-colors ${isDark ? 'hover:text-[#c89b2a]' : 'hover:text-[#7c1fa0]'}`}>Terms of Service</a>
            <a className={`cursor-pointer transition-colors ${isDark ? 'hover:text-[#c89b2a]' : 'hover:text-[#7c1fa0]'}`}>Contact</a>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} isDark={isDark} />}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} isDark={isDark} />}
    </div>
  )
}

// ─── LEADERBOARD COMPONENT ────────────────────────────────────────────────────
function LeaderboardSection({ isDark }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/get_leaderboard.php')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') setLeaderboard(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const rankMeta = [
    {
      color: 'text-amber-400',
      bg: isDark ? 'bg-amber-500/10 border-amber-400/30' : 'bg-amber-50 border-amber-300',
      ring: 'ring-4 ring-amber-400/50',
      crown: '👑',
      size: 'w-24 h-24',
      podiumH: 'h-52',
      label: '1st',
    },
    {
      color: 'text-slate-300',
      bg: isDark ? 'bg-slate-500/10 border-slate-400/20' : 'bg-slate-100 border-slate-300',
      ring: 'ring-4 ring-slate-300/40',
      crown: '🥈',
      size: 'w-20 h-20',
      podiumH: 'h-40',
      label: '2nd',
    },
    {
      color: 'text-orange-400',
      bg: isDark ? 'bg-orange-500/10 border-orange-400/20' : 'bg-orange-50 border-orange-200',
      ring: 'ring-4 ring-orange-300/40',
      crown: '🥉',
      size: 'w-20 h-20',
      podiumH: 'h-36',
      label: '3rd',
    },
  ];

  const getAvatar = (entry) =>
    entry.profile_picture
      ? `http://localhost:8080/api/${entry.profile_picture}`
      : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(entry.name)}`;

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  // Reorder for podium: 2nd — 1st — 3rd
  const podiumOrder = top3.length === 3
    ? [{ entry: top3[1], meta: rankMeta[1] }, { entry: top3[0], meta: rankMeta[0] }, { entry: top3[2], meta: rankMeta[2] }]
    : top3.map((e, i) => ({ entry: e, meta: rankMeta[i] }));

  return (
    <section className={`relative w-full py-20 px-6 overflow-hidden ${isDark ? 'bg-[#0a0314]' : 'bg-slate-50'}`}>
      {/* Ambient blobs */}
      <div className={`absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none ${isDark ? 'bg-[#7c1fa0]/20' : 'bg-[#7c1fa0]/6'}`} />
      <div className={`absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none ${isDark ? 'bg-[#c89b2a]/10' : 'bg-[#c89b2a]/5'}`} />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-14" style={{ animation: 'fadeUp 0.6s ease both' }}>
          <div className={`inline-block border rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase mb-4 ${isDark ? 'bg-[#c89b2a]/10 border-[#c89b2a]/30 text-[#c89b2a]' : 'bg-[#f3e8ff] border-[#e9d5ff] text-[#7c1fa0]'}`}>
            Hall of Fame
          </div>
          <h2 className={`font-serif text-4xl md:text-5xl font-black mb-3 ${isDark ? 'text-white' : 'text-[#2d0f4d]'}`}>
            🏆 Top Students
          </h2>
          <p className={`text-base max-w-md mx-auto ${isDark ? 'text-purple-200/60' : 'text-slate-500'}`}>
            The most dedicated sit-in warriors ranked by total lab session time.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className={`w-10 h-10 rounded-full border-4 border-t-transparent animate-spin ${isDark ? 'border-[#c89b2a]' : 'border-[#7c1fa0]'}`} />
          </div>
        ) : leaderboard.length === 0 ? (
          <p className={`text-center py-16 text-sm ${isDark ? 'text-purple-200/40' : 'text-slate-400'}`}>
            No session data yet. Be the first to earn a spot!
          </p>
        ) : (
          <>
            {/* ── PODIUM (Top 3) ── */}
            <div className="flex items-end justify-center gap-4 md:gap-6 mb-10">
              {podiumOrder.map(({ entry, meta }, i) => (
                <div key={entry.rank} className="flex flex-col items-center gap-2" style={{ animation: `fadeUp 0.6s ease ${i * 0.12}s both` }}>
                  {/* Crown / medal */}
                  <span className="text-2xl leading-none">{meta.crown}</span>

                  {/* Avatar */}
                  <div className={`rounded-full overflow-hidden flex-shrink-0 border-2 ${meta.ring} ${meta.size} ${isDark ? 'border-white/10' : 'border-white'}`}>
                    <img
                      src={getAvatar(entry)}
                      alt={entry.name}
                      className="w-full h-full object-cover object-center"
                      onError={e => { e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(entry.name)}`; }}
                    />
                  </div>

                  {/* Name / course / time */}
                  <div className="text-center px-1">
                    <p className={`font-bold text-sm leading-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>{entry.name}</p>
                    <p className={`text-xs mt-0.5 ${isDark ? 'text-purple-300/60' : 'text-slate-500'}`}>
                      {entry.course}{entry.year ? ` · Y${entry.year}` : ''}
                    </p>
                    <p className={`text-xs font-bold mt-1 ${meta.color}`}>{entry.total_hours}</p>
                  </div>

                  {/* Podium block */}
                  <div className={`w-24 md:w-28 rounded-t-xl flex items-center justify-center border-2 ${meta.podiumH} ${meta.bg}`}>
                    <span className={`text-3xl font-black ${meta.color}`}>{entry.rank}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* ── 4th & 5th list ── */}
            {rest.length > 0 && (
              <div className={`rounded-2xl border overflow-hidden divide-y ${isDark ? 'bg-[#1a0830]/50 border-purple-500/15 divide-purple-500/10' : 'bg-white border-slate-200 divide-slate-100'}`}>
                {rest.map((entry, i) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center gap-4 px-6 py-4 transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}
                    style={{ animation: `fadeUp 0.6s ease ${(i + 3) * 0.12}s both` }}
                  >
                    <span className={`text-lg font-black w-8 text-center flex-shrink-0 ${isDark ? 'text-purple-400/50' : 'text-slate-400'}`}>{entry.rank}</span>
                    <div className={`w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 ${isDark ? 'border-purple-500/20' : 'border-slate-200'}`}>
                      <img
                        src={getAvatar(entry)}
                        alt={entry.name}
                        className="w-full h-full object-cover object-center"
                        onError={e => { e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(entry.name)}`; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-sm truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>{entry.name}</p>
                      <p className={`text-xs ${isDark ? 'text-purple-300/50' : 'text-slate-400'}`}>
                        {entry.course}{entry.year ? ` · Year ${entry.year}` : ''}
                      </p>
                    </div>
                    <span className={`text-sm font-bold flex-shrink-0 ${isDark ? 'text-[#c89b2a]' : 'text-[#7c1fa0]'}`}>{entry.total_hours}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}