import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// Curated color palette matching the design system
const CHART_COLORS = [
  '#4a0080',   // Primary purple
  '#c89b2a',   // Gold accent
  '#7c1fa0',   // Lighter purple
  '#d8b4fe',   // Lavender
  '#f59e0b',   // Amber
  '#6d28d9',   // Violet
  '#a855f7',   // Purple-400
  '#e879f9',   // Fuchsia
  '#8b5cf6',   // Violet-400
  '#fbbf24',   // Yellow-400
  '#94a3b8',   // Slate-400 (for "Others")
];

export default function AnalyticsCharts({ isDark = false }) {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    // Trigger fresh animation every time the component mounts (navigating to Home)
    setAnimationKey(prev => prev + 1);
    
    fetch(`${import.meta.env.VITE_API_BASE_URL}/get_analytics.php`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setAnalyticsData(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch analytics:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[0, 1].map(i => (
          <div
            key={i}
            className={`border rounded-xl shadow-sm p-8 flex flex-col items-center justify-center min-h-[380px] transition-colors duration-300 ${isDark ? 'bg-[#1e0838]/80 border-purple-500/20' : 'bg-white border-slate-200'}`}
          >
            <div className="w-10 h-10 border-4 border-[#4a0080]/20 border-t-[#4a0080] rounded-full animate-spin"></div>
            <p className={`text-sm font-semibold mt-4 ${isDark ? 'text-purple-300' : 'text-slate-500'}`}>Loading analytics...</p>
          </div>
        ))}
      </div>
    );
  }

  if (!analyticsData || analyticsData.students.length === 0) {
    return (
      <div className={`border rounded-xl shadow-sm p-8 text-center transition-colors duration-300 ${isDark ? 'bg-[#1e0838]/80 border-purple-500/20' : 'bg-white border-slate-200'}`}>
        <svg className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-purple-500/40' : 'text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
        <p className={`font-bold ${isDark ? 'text-purple-200' : 'text-slate-700'}`}>No Analytics Data Yet</p>
        <p className={`text-sm mt-1 ${isDark ? 'text-purple-400' : 'text-slate-500'}`}>Sit-in history data is needed to generate charts.</p>
      </div>
    );
  }

  const { students, grand_total_hours } = analyticsData;
  const labels = students.map(s => s.name);
  const hours = students.map(s => s.total_hours);
  const percentages = students.map(s => s.percentage);
  const colors = students.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);

  // ─── Donut Chart Config ────────────────────────────────────────
  const donutData = {
    labels,
    datasets: [{
      data: hours,
      backgroundColor: colors,
      borderColor: isDark ? '#1e0838' : '#ffffff',
      borderWidth: 3,
      hoverOffset: 12,
    }],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '62%',
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1200,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#1e0838' : 'rgba(255,255,255,0.95)',
        titleColor: isDark ? '#c89b2a' : '#4a0080',
        bodyColor: isDark ? '#e9d5ff' : '#334155',
        borderColor: isDark ? 'rgba(139,92,246,0.2)' : 'rgba(0,0,0,0.08)',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 14,
        titleFont: { weight: 'bold', size: 13 },
        bodyFont: { size: 12 },
        boxPadding: 6,
        callbacks: {
          label: (context) => {
            const idx = context.dataIndex;
            return `${hours[idx].toFixed(1)} hrs (${percentages[idx]}%)`;
          },
        },
      },
    },
  };

  // ─── Bar Chart Config ──────────────────────────────────────────
  const barData = {
    labels,
    datasets: [{
      label: 'Sit-In Hours',
      data: hours,
      backgroundColor: colors.map(c => c + 'CC'), // Slight transparency
      borderColor: colors,
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
      barPercentage: 0.65,
      categoryPercentage: 0.8,
    }],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'x',
    animation: {
      duration: 1400,
      easing: 'easeOutQuart',
      delay: (ctx) => ctx.dataIndex * 80,
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: isDark ? '#c4b5fd' : '#64748b',
          font: { size: 10, weight: '600' },
          maxRotation: 45,
          minRotation: 30,
        },
        border: { display: false },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: isDark ? 'rgba(139,92,246,0.08)' : 'rgba(0,0,0,0.05)',
          drawBorder: false,
        },
        ticks: {
          color: isDark ? '#c4b5fd' : '#64748b',
          font: { size: 11, weight: '600' },
          callback: (value) => `${value}h`,
        },
        border: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#1e0838' : 'rgba(255,255,255,0.95)',
        titleColor: isDark ? '#c89b2a' : '#4a0080',
        bodyColor: isDark ? '#e9d5ff' : '#334155',
        borderColor: isDark ? 'rgba(139,92,246,0.2)' : 'rgba(0,0,0,0.08)',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 14,
        titleFont: { weight: 'bold', size: 13 },
        bodyFont: { size: 12 },
        boxPadding: 6,
        callbacks: {
          label: (context) => {
            const idx = context.dataIndex;
            return `${hours[idx].toFixed(1)} hrs (${percentages[idx]}%)`;
          },
        },
      },
    },
  };

  return (
    <div key={animationKey} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Donut Chart Card */}
      <div className={`border rounded-xl shadow-sm flex flex-col overflow-hidden transition-all duration-300 ${isDark ? 'bg-[#1e0838]/80 border-purple-500/20' : 'bg-white border-slate-200'}`}>
        <div className={`shrink-0 backdrop-blur-md border-b px-4 py-3 font-semibold flex items-center gap-2 transition-all duration-300 ${isDark ? 'bg-[#1e0838]/80 border-purple-500/20 text-[#c89b2a]' : 'bg-white/80 border-slate-200 text-[#4a0080]'}`}>
          <svg className="w-5 h-5 text-[#c89b2a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
          </svg>
          Sit-In Hours Distribution
        </div>
        
        <div className="flex-1 p-6 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[280px] aspect-square">
            <Doughnut data={donutData} options={donutOptions} />
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {grand_total_hours.toFixed(1)}
              </span>
              <span className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-purple-400' : 'text-slate-400'}`}>
                Total Hours
              </span>
            </div>
          </div>

          {/* Custom Legend */}
          <div className={`mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs font-bold ${isDark ? 'text-purple-200' : 'text-slate-600'}`}>
            {students.map((student, index) => (
              <div key={student.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm shrink-0 shadow-sm" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}></div>
                <span className="truncate max-w-[100px]" title={student.name}>{student.name}</span>
                <span className={`${isDark ? 'text-purple-400' : 'text-slate-400'}`}>({student.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bar Chart Card */}
      <div className={`border rounded-xl shadow-sm flex flex-col overflow-hidden transition-all duration-300 ${isDark ? 'bg-[#1e0838]/80 border-purple-500/20' : 'bg-white border-slate-200'}`}>
        <div className={`shrink-0 backdrop-blur-md border-b px-4 py-3 font-semibold flex items-center gap-2 transition-all duration-300 ${isDark ? 'bg-[#1e0838]/80 border-purple-500/20 text-[#c89b2a]' : 'bg-white/80 border-slate-200 text-[#4a0080]'}`}>
          <svg className="w-5 h-5 text-[#c89b2a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          Top Students by Sit-In Hours
        </div>
        
        <div className="flex-1 p-6 flex items-center">
          <div className="w-full h-[320px]">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
