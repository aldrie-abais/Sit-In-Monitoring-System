import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SearchStudentModal from '../components/modal/SearchStudentModal';
import SitInFormModal from '../components/modal/SitInFormModal';
import FeatureComingSoonModal from '../components/modal/FeatureComingSoonModal';
import LogoutModal from '../components/modal/LogoutModal';

export default function AdminReservation() {
  const navigate = useNavigate();
  
  // Navigation State
  const [showReportsSoon, setShowReportsSoon] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [activeStudent, setActiveStudent] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('isDark') === 'true');

  useEffect(() => {
    localStorage.setItem('isDark', isDark);
  }, [isDark]);

  // Column 1: Labs & PCs
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [showPcModal, setShowPcModal] = useState(false);
  const [labPcs, setLabPcs] = useState([]);

  // Column 2: Pending Queue
  const [pendingRequests, setPendingRequests] = useState([]);

  // Column 3: System Log
  const [systemLogs, setSystemLogs] = useState([]);

  const handleLogout = () => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser && savedUser.user_id) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/logout.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: savedUser.user_id })
      }).catch(err => console.error(err));
    }
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    navigate('/');
  };

  const fetchLabs = () => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/get_labs.php`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLabs(data.data);
        }
      })
      .catch(err => console.error(err));
  };

  const fetchPendingRequests = () => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/get_pending_reservations.php`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setPendingRequests(data.data);
        }
      })
      .catch(err => console.error(err));
  };

  const fetchSystemLogs = () => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/get_system_logs.php`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setSystemLogs(data.data);
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchLabs();
    fetchPendingRequests();
    fetchSystemLogs();
  }, []);

  const exportToCSV = () => {
    if (systemLogs.length === 0) return alert("No logs to export!");
    
    // Header
    const headers = ["Student Name", "Lab Name", "PCs Reserved", "Action", "Timestamp"];
    
    // Rows
    const rows = systemLogs.map(log => [
      log.studentName,
      log.labName,
      log.pcs.join('; '),
      log.action,
      log.timestamp
    ]);
    
    // Combine
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `system_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    if (systemLogs.length === 0) return alert("No logs to export!");

    const printWindow = window.open("", "_blank");
    if (!printWindow) return alert("Pop-up blocked! Please allow pop-ups for this site.");
    
    const html = `
      <html>
        <head>
          <title>CCS Sit-In System Log Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #333;
              margin: 40px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #4a0080;
              padding-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              color: #4a0080;
              font-size: 24px;
            }
            .header p {
              margin: 5px 0 0;
              color: #c89b2a;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 2px;
              font-weight: bold;
            }
            .meta {
              display: flex;
              justify-content: space-between;
              font-size: 12px;
              color: #666;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 10px;
              text-align: left;
              font-size: 12px;
            }
            th {
              background-color: #f2f2f2;
              color: #4a0080;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .action-badge {
              display: inline-block;
              padding: 3px 8px;
              border-radius: 12px;
              font-size: 10px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .badge-approved {
              background-color: #d1fae5;
              color: #065f46;
            }
            .badge-denied {
              background-color: #fee2e2;
              color: #991b1b;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 10px;
              color: #999;
              border-top: 1px solid #eee;
              padding-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>CCS Sit-In System Log Report</h1>
            <p>University of Cebu - College of Information & Computer Studies</p>
          </div>
          <div class="meta">
            <span><strong>Generated Date:</strong> ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            <span><strong>Total Records:</strong> ${systemLogs.length}</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Laboratory</th>
                <th>PCs Reserved</th>
                <th>Action</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              ${systemLogs.map(log => `
                <tr>
                  <td><strong>${log.studentName}</strong></td>
                  <td>${log.labName}</td>
                  <td>${log.pcs.join(', ')}</td>
                  <td>
                    <span class="action-badge ${log.action === 'Approved' ? 'badge-approved' : 'badge-denied'}">
                      ${log.action}
                    </span>
                  </td>
                  <td>${log.timestamp}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>© ${new Date().getFullYear()} CCS Sit-In Monitoring System. All rights reserved.</p>
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const openPcModal = (lab) => {
    setSelectedLab(lab);
    fetch(`${import.meta.env.VITE_API_BASE_URL}/get_pcs_by_lab.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lab_id: lab.id })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setLabPcs(data.data);
        setShowPcModal(true);
      }
    })
    .catch(err => console.error(err));
  };

  const cyclePcStatus = (pcId) => {
    const pc = labPcs.find(p => p.id === pcId);
    if (!pc) return;

    const nextStatusMap = {
      'Available': 'Occupied',
      'Occupied': 'On-Maintenance',
      'On-Maintenance': 'Available'
    };
    const nextStatus = nextStatusMap[pc.status] || 'Available';

    fetch(`${import.meta.env.VITE_API_BASE_URL}/update_pc_status.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pc_id: pcId, status: nextStatus })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        // Refresh PCs list inside modal
        if (selectedLab) {
          openPcModal(selectedLab);
        }
        // Refresh Labs list to update available count in Column 1
        fetchLabs();
      } else {
        alert("Failed to update PC status: " + data.message);
      }
    })
    .catch(err => console.error(err));
  };

  const toggleLabStatus = () => {
    if (!selectedLab) return;
    const newStatus = selectedLab.is_available == 1 ? 0 : 1;

    fetch(`${import.meta.env.VITE_API_BASE_URL}/update_lab_status.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lab_id: selectedLab.id, is_available: newStatus })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        setSelectedLab(prev => ({ ...prev, is_available: newStatus }));
        fetchLabs();
      } else {
        alert("Failed to update lab status: " + data.message);
      }
    })
    .catch(err => console.error(err));
  };

  const handleApprove = (req) => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/process_reservation.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reservation_id: req.id,
        action: 'Approved',
        student_name: req.studentName,
        lab_name: req.labName,
        pc_numbers: req.pcs
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        fetchPendingRequests();
        fetchSystemLogs();
      } else {
        alert("Failed to approve reservation: " + data.message);
      }
    })
    .catch(err => console.error(err));
  };

  const handleDeny = (req) => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/process_reservation.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reservation_id: req.id,
        action: 'Denied',
        student_name: req.studentName,
        lab_name: req.labName,
        pc_numbers: req.pcs
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        fetchPendingRequests();
        fetchSystemLogs();
      } else {
        alert("Failed to deny reservation: " + data.message);
      }
    })
    .catch(err => console.error(err));
  };

  // Determine the CSS grid dimensions for the PC modal (frontend overriding to 7 rows per col)
  const maxCol = Math.max(...labPcs.map(pc => Math.ceil(pc.pc_number / 7)), 7);
  let gridCols = [];
  for (let c = 1; c <= maxCol; c++) {
      gridCols.push('minmax(0, 1fr)');
      if (c % 2 === 0 && c !== maxCol) {
          gridCols.push('2.5rem'); // Add a wide spacer column between major groups
      }
  }
  const pcGridTemplate = gridCols.join(' ');
  const getVisualCol = (col) => col + Math.floor((col - 1) / 2);

  return (
    <div className={`h-screen w-full font-sans flex flex-col overflow-hidden transition-colors duration-300 ${isDark ? 'bg-[#0f0520] text-purple-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* NAVIGATION BAR */}
      <nav className={`px-8 py-4 flex items-center justify-between shadow-sm shrink-0 border-b transition-colors duration-300 ${isDark ? 'bg-[#1e0838]/80 border-purple-500/20 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#4a0080] rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-serif text-xl font-bold">UC</span>
          </div>
          <div>
            <h1 className={`font-serif text-xl font-bold tracking-tight ${isDark ? 'text-[#c89b2a]' : 'text-[#4a0080]'}`}>CCS Sit-In Monitoring</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#c89b2a] -mt-1">Administrator Panel</p>
          </div>
        </div>
 
        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <Link to="/admin-dashboard" className={`${isDark ? 'text-purple-200 hover:text-[#c89b2a]' : 'text-slate-500 hover:text-[#4a0080]'} transition-colors`}>Home</Link>
            <span className={`${isDark ? 'text-[#c89b2a] border-[#c89b2a]' : 'text-[#4a0080] border-[#4a0080]'} border-b-2 pb-1 cursor-default`}>Reservation</span>
            <Link to="/admin-dashboard/software" className={`${isDark ? 'text-purple-200 hover:text-[#c89b2a]' : 'text-slate-500 hover:text-[#4a0080]'} transition-colors`}>Software</Link>
            <Link to="/admin-dashboard/students" className={`${isDark ? 'text-purple-200 hover:text-[#c89b2a]' : 'text-slate-500 hover:text-[#4a0080]'} transition-colors`}>Students</Link>
            <Link to="/admin-dashboard/records" className={`${isDark ? 'text-purple-200 hover:text-[#c89b2a]' : 'text-slate-500 hover:text-[#4a0080]'} transition-colors`}>Records</Link>
          </div>
          
          <button 
            onClick={() => setIsDark(!isDark)} 
            className={`text-xl p-2 rounded-full transition-all duration-200 ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-black/5 hover:bg-black/10 text-slate-600'}`} 
            title="Toggle Theme"
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          <button onClick={() => setShowLogoutModal(true)} className="bg-[#4a0080] text-white px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide hover:bg-purple-900 transition-all shadow-md active:scale-95 inline-flex items-center gap-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 15l3-3m0 0l-3-3m3 3H9" />
              </svg>
            Log out
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="p-8 flex-1 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-6">
            <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Reservation Management</h2>
            
            {/* Search Button moved here */}
            <button 
                onClick={() => setShowSearch(true)} 
                className={`px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-sm active:scale-95 inline-flex items-center gap-2.5 border ${isDark ? 'bg-[#1e0838] border-purple-500/20 text-purple-200 hover:bg-[#2d114d]' : 'bg-white border-slate-200 text-[#4a0080] hover:bg-slate-50'}`}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                Search Student
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden h-full">
            
          {/* Column 1: CSS Laboratories */}
          <div className={`border rounded-xl shadow-sm flex flex-col h-full overflow-hidden transition-colors duration-300 ${isDark ? 'bg-[#1e0838]/80 border-purple-500/20' : 'bg-white border-slate-200'}`}>
            <div className={`shrink-0 backdrop-blur-md border-b px-4 py-3 font-semibold flex items-center gap-2 transition-colors duration-300 ${isDark ? 'bg-[#1e0838]/80 border-purple-500/20 text-[#c89b2a]' : 'bg-white/80 border-slate-200 text-[#4a0080]'}`}>
              <svg className="w-5 h-5 text-[#c89b2a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              CSS Laboratories
            </div>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
                {labs.map(lab => (
                    <div 
                        key={lab.id} 
                        onClick={() => openPcModal(lab)}
                        className={`p-5 rounded-xl border hover:shadow-md cursor-pointer transition-all flex flex-col group ${isDark ? 'border-purple-500/20 bg-[#2d114d]/30 hover:border-[#c89b2a]/50' : 'border-slate-200 bg-white hover:border-[#4a0080]/50'}`}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className={`font-bold text-lg transition-colors ${isDark ? 'text-purple-100 group-hover:text-[#c89b2a]' : 'text-slate-800 group-hover:text-[#4a0080]'}`}>{lab.name}</h3>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${lab.is_available == 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {lab.is_available == 1 ? 'Available' : 'Unavailable'}
                            </span>
                        </div>
                        <p className={`text-sm font-medium ${isDark ? 'text-purple-300' : 'text-slate-500'}`}>
                            <span className="text-[#c89b2a] font-bold">{lab.available_pcs}</span> / {lab.total_pcs} Available
                        </p>
                    </div>
                ))}
            </div>
          </div>

          {/* Column 2: Pending Queue */}
          <div className={`border rounded-xl shadow-sm flex flex-col h-full overflow-hidden transition-colors duration-300 ${isDark ? 'bg-[#1e0838]/80 border-purple-500/20' : 'bg-white border-slate-200'}`}>
            <div className={`shrink-0 backdrop-blur-md border-b px-4 py-3 font-semibold flex items-center gap-2 transition-colors duration-300 ${isDark ? 'bg-[#1e0838]/80 border-purple-500/20 text-[#c89b2a]' : 'bg-white/80 border-slate-200 text-[#4a0080]'}`}>
              <svg className="w-5 h-5 text-[#c89b2a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Pending Queue
            </div>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
                {pendingRequests.length > 0 ? pendingRequests.map(req => (
                    <div key={req.id} className={`p-4 border rounded-xl shadow-sm transition-colors duration-300 ${isDark ? 'bg-[#2d114d]/30 border-purple-500/10' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 className={`font-bold ${isDark ? 'text-purple-100' : 'text-slate-800'}`}>{req.studentName}</h4>
                                <p className={`text-xs font-semibold mt-0.5 ${isDark ? 'text-[#c89b2a]' : 'text-[#4a0080]'}`}>{req.labName}</p>
                            </div>
                            <span className={`text-xs font-medium text-right ${isDark ? 'text-purple-300' : 'text-slate-500'}`}>
                                {req.date}<br/>{req.time}
                            </span>
                        </div>
                        <p className={`text-sm mb-4 ${isDark ? 'text-purple-200' : 'text-slate-600'}`}>Requested PCs: <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>{req.pcs.join(', ')}</span></p>
                        <div className="flex gap-2">
                            <button onClick={() => handleApprove(req)} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Approve
                            </button>
                            <button onClick={() => handleDeny(req)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                Deny
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="text-center text-sm text-slate-500 mt-10">No pending requests.</div>
                )}
            </div>
          </div>

          {/* Column 3: System Log */}
          <div className={`border rounded-xl shadow-sm flex flex-col h-full overflow-hidden transition-colors duration-300 ${isDark ? 'bg-[#1e0838]/80 border-purple-500/20' : 'bg-white border-slate-200'}`}>
            <div className={`shrink-0 backdrop-blur-md border-b px-4 py-3 font-semibold flex items-center justify-between transition-colors duration-300 ${isDark ? 'bg-[#1e0838]/80 border-purple-500/20 text-[#c89b2a]' : 'bg-white/80 border-slate-200 text-[#4a0080]'}`}>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#c89b2a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                System Log
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={exportToCSV}
                  title="Export to CSV"
                  className={`p-1.5 rounded-lg border transition-all text-xs font-bold flex items-center gap-1 ${
                    isDark 
                      ? 'bg-purple-950/40 border-purple-500/20 text-purple-200 hover:bg-purple-900/40' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  CSV
                </button>
                <button 
                  onClick={exportToPDF}
                  title="Export to PDF"
                  className={`p-1.5 rounded-lg border transition-all text-xs font-bold flex items-center gap-1 ${
                    isDark 
                      ? 'bg-purple-950/40 border-purple-500/20 text-purple-200 hover:bg-purple-900/40' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                  PDF
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
                {systemLogs.length > 0 ? systemLogs.map(log => (
                    <div key={log.id} className={`p-3 border rounded-lg shadow-sm flex flex-col transition-colors duration-300 ${isDark ? 'bg-[#2d114d]/30 border-purple-500/10' : 'bg-white border-slate-100'}`}>
                        <div className="flex justify-between items-center mb-1">
                            <span className={`font-bold text-sm ${isDark ? 'text-purple-100' : 'text-slate-800'}`}>{log.studentName}</span>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${log.action === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {log.action}
                            </span>
                        </div>
                        <span className={`text-xs font-semibold ${isDark ? 'text-[#c89b2a]' : 'text-[#4a0080]'}`}>{log.labName} • PCs: {log.pcs.join(', ')}</span>
                        <span className={`text-[10px] mt-2 text-right ${isDark ? 'text-purple-400' : 'text-slate-400'}`}>{log.timestamp}</span>
                    </div>
                )) : (
                    <div className="text-center text-sm text-slate-500 mt-10">No system logs yet.</div>
                )}
            </div>
          </div>

        </div>
      </main>

      {/* PC Modal */}
      {showPcModal && selectedLab && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className={`rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden ${isDark ? 'bg-[#1e0838]' : 'bg-white'}`}>
            <div className={`p-6 border-b flex justify-between items-center ${isDark ? 'bg-[#1e0838] border-purple-500/20' : 'bg-white border-slate-100'}`}>
              <div>
                <h3 className={`text-xl font-bold ${isDark ? 'text-[#c89b2a]' : 'text-[#4a0080]'}`}>{selectedLab.name} - Status Management</h3>
                <p className={`text-sm mt-1 ${isDark ? 'text-purple-300' : 'text-slate-500'}`}>Click a PC to change its status.</p>
              </div>
              <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-2 border-r pr-4 ${isDark ? 'border-purple-500/20' : 'border-slate-200'}`}>
                      <span className={`text-sm font-semibold ${isDark ? 'text-purple-200' : 'text-slate-600'}`}>Lab Status:</span>
                      <button 
                          onClick={toggleLabStatus}
                          className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${selectedLab.is_available == 1 ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                      >
                          {selectedLab.is_available == 1 ? 'Available' : 'Unavailable'}
                      </button>
                  </div>
                  <button onClick={() => setShowPcModal(false)} className={`transition-colors p-2 rounded-full ${isDark ? 'text-purple-300 hover:text-white bg-white/5 hover:bg-white/10' : 'text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
              </div>
            </div>
            
            <div className={`p-8 overflow-y-auto flex-1 custom-scrollbar ${isDark ? 'bg-[#0f0520]' : 'bg-slate-50'}`}>
              <div className="grid gap-3" style={{ gridTemplateColumns: pcGridTemplate }}>
                {labPcs.map(pc => {
                    const virtualCol = Math.ceil(pc.pc_number / 7);
                    const virtualRow = ((pc.pc_number - 1) % 7) + 1;
                    
                    let bgClass = 'bg-white border-slate-200 text-slate-700 hover:border-[#4a0080]/30';
                    if (pc.status === 'Occupied') bgClass = 'bg-amber-100 border-amber-300 text-amber-800';
                    else if (pc.status === 'On-Maintenance') bgClass = 'bg-red-100 border-red-300 text-red-800';
                    else if (pc.status === 'Available') bgClass = 'bg-white border-slate-200 text-slate-700 hover:border-[#4a0080]/30';

                    return (
                        <button 
                            key={pc.id}
                            onClick={() => cyclePcStatus(pc.id)}
                            className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center aspect-square transition-all relative overflow-hidden ${bgClass}`}
                            style={{ gridColumn: getVisualCol(virtualCol), gridRow: virtualRow }}
                        >
                            <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            <span className="text-xs font-bold">PC {pc.pc_number}</span>
                            <span className="text-[9px] uppercase tracking-wider font-bold mt-1 opacity-80">
                                {pc.status}
                            </span>
                        </button>
                    );
                })}
              </div>
            </div>
            
            <div className={`p-4 border-t flex justify-between items-center text-sm ${isDark ? 'bg-[#1e0838] border-purple-500/20 text-purple-300' : 'bg-white border-slate-100 text-slate-500'}`}>
                <div className="flex gap-4">
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-white border border-slate-300"></div>Available</div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-amber-100 border border-amber-300"></div>Occupied</div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-red-100 border border-red-300"></div>Maintenance</div>
                </div>
                <button 
                    onClick={() => setShowPcModal(false)}
                    className="font-bold py-2 px-6 rounded-xl bg-[#c89b2a] hover:bg-amber-600 text-white shadow-md active:scale-95 transition-all"
                >
                    Done
                </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      {showSearch && (
        <SearchStudentModal 
          onClose={() => setShowSearch(false)} 
          onStudentFound={(student) => {
            setShowSearch(false);
            setActiveStudent(student);
          }} 
        />
      )}

      {activeStudent && (
        <SitInFormModal 
          student={activeStudent}
          onClose={() => setActiveStudent(null)}
          onSuccess={() => {
            setActiveStudent(null);
            // Optionally refresh some data here if needed
          }}
        />
      )}

      {showReportsSoon && (
        <FeatureComingSoonModal
          onClose={() => setShowReportsSoon(false)}
          title="Reports"
          message="This feature will be available soon!"
        />
      )}

      <LogoutModal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)} 
        onConfirm={handleLogout} 
      />

    </div>
  );
}
