import React, { useState, useEffect } from 'react';

export default function AddSoftwareModal({ onClose, onSuccess }) {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isDark = localStorage.getItem('isDark') === 'true';
  
  // Form State
  const [name, setName] = useState('');
  const [version, setVersion] = useState('');
  const [licenseType, setLicenseType] = useState('Free');
  const [installationDate, setInstallationDate] = useState('');
  const [description, setDescription] = useState('');
  const [deploymentNotes, setDeploymentNotes] = useState('');
  const [selectedLabs, setSelectedLabs] = useState([]);

  // Fetch Labs on mount
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/get_labs.php`)
      .then(res => res.json())
      .then(resData => {
        if (resData.success && resData.data) {
          setLabs(resData.data);
        } else {
          setError('Failed to fetch laboratory rooms.');
        }
      })
      .catch(err => {
        console.error(err);
        setError('Connection error while fetching labs.');
      });
  }, []);

  const handleLabToggle = (labId) => {
    if (selectedLabs.includes(labId)) {
      setSelectedLabs(selectedLabs.filter(id => id !== labId));
    } else {
      setSelectedLabs([...selectedLabs, labId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!name.trim()) {
      setError('Software Name is required.');
      return;
    }
    if (selectedLabs.length === 0) {
      setError('Please select at least one laboratory room for deployment.');
      return;
    }

    setLoading(true);

    try {
      // 1. Add the software to the database
      const softwareResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/add_software.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          version: version.trim(),
          license_type: licenseType,
          installation_date: installationDate,
          description: description.trim(),
          deployment_notes: deploymentNotes.trim()
        })
      });

      const softwareData = await softwareResponse.json();

      if (!softwareData.success) {
        throw new Error(softwareData.message || 'Failed to create software record.');
      }

      const softwareId = softwareData.software_id;

      // 2. Map lab deployments using assign_software_to_lab.php
      const deploymentPromises = selectedLabs.map(labId => {
        return fetch(`${import.meta.env.VITE_API_BASE_URL}/assign_software_to_lab.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            software_id: softwareId,
            lab_id: labId
          })
        }).then(res => res.json());
      });

      const deploymentResults = await Promise.all(deploymentPromises);

      // Verify at least one successful lab assignment
      const anyFailure = deploymentResults.some(res => !res.success);
      if (anyFailure) {
        console.warn('Some software lab assignments might have encountered warnings.');
      }

      setLoading(false);
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred during saving.');
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-[110] flex items-center justify-center backdrop-blur-sm p-4 overflow-y-auto ${isDark ? 'bg-[#0f051e]/80' : 'bg-slate-900/60'}`}>
      <div className={`w-full max-w-lg rounded-2xl shadow-2xl border overflow-hidden my-8 ${isDark ? 'bg-[#1e0838] border-purple-500/20' : 'bg-white border-slate-200'}`}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-[#4a0080] to-purple-800 text-white">
          <div>
            <h2 className="text-lg font-bold">Add Laboratory Software</h2>
            <p className="text-xs text-purple-200">Register new applications & schedule classroom installations</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-white/80 hover:text-white font-bold text-2xl transition-colors"
            aria-label="Close add software modal"
          >
            &times;
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2.5">
              <svg className="w-4.5 h-4.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>{error}</span>
            </div>
          )}

          {/* Software Name */}
          <div className="space-y-1.5">
            <label className={`text-xs font-bold uppercase tracking-wider block ${isDark ? 'text-purple-300' : 'text-slate-600'}`}>Software Name *</label>
            <input 
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Anaconda Navigator"
              className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#4a0080]/20 focus:border-[#4a0080] font-medium text-sm transition-all ${isDark ? 'bg-white/5 border-purple-500/20 text-purple-100 placeholder-purple-300/40' : 'border-slate-200'}`}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Version */}
            <div className="space-y-1.5">
              <label className={`text-xs font-bold uppercase tracking-wider block ${isDark ? 'text-purple-300' : 'text-slate-600'}`}>Version</label>
              <input 
                type="text"
                value={version}
                onChange={e => setVersion(e.target.value)}
                placeholder="e.g., 2.4.0"
                className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#4a0080]/20 focus:border-[#4a0080] font-medium text-sm transition-all ${isDark ? 'bg-white/5 border-purple-500/20 text-purple-100 placeholder-purple-300/40' : 'border-slate-200'}`}
              />
            </div>

            {/* License Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">License Type</label>
              <select 
                value={licenseType}
                onChange={e => setLicenseType(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#4a0080]/20 focus:border-[#4a0080] font-semibold text-sm transition-all ${isDark ? 'bg-white/5 border-purple-500/20 text-purple-100' : 'border-slate-200 bg-white'}`}
              >
                <option value="Free">Free</option>
                <option value="Open Source">Open Source</option>
                <option value="Commercial">Commercial</option>
                <option value="Trial">Trial</option>
              </select>
            </div>

            {/* Installation Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Installation Date</label>
              <input 
                type="date"
                value={installationDate}
                onChange={e => setInstallationDate(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#4a0080]/20 focus:border-[#4a0080] font-medium text-sm transition-all ${isDark ? 'bg-white/5 border-purple-500/20 text-purple-100' : 'border-slate-200 bg-white'}`}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className={`text-xs font-bold uppercase tracking-wider block ${isDark ? 'text-purple-300' : 'text-slate-600'}`}>Description</label>
            <textarea 
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Short description of the software..."
              rows={2}
              className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#4a0080]/20 focus:border-[#4a0080] font-medium text-sm transition-all resize-none ${isDark ? 'bg-white/5 border-purple-500/20 text-purple-100 placeholder-purple-300/40' : 'border-slate-200'}`}
            />
          </div>

          {/* Deployment Notes */}
          <div className="space-y-1.5">
            <label className={`text-xs font-bold uppercase tracking-wider block ${isDark ? 'text-purple-300' : 'text-slate-600'}`}>Deployment Notes</label>
            <textarea 
              value={deploymentNotes}
              onChange={e => setDeploymentNotes(e.target.value)}
              placeholder="Additional compiler dependencies or instructions..."
              rows={2}
              className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#4a0080]/20 focus:border-[#4a0080] font-medium text-sm transition-all resize-none ${isDark ? 'bg-white/5 border-purple-500/20 text-purple-100 placeholder-purple-300/40' : 'border-slate-200'}`}
            />
          </div>

          {/* Lab Deployment Checkboxes */}
          <div className={`space-y-2 border-t pt-4 ${isDark ? 'border-purple-500/10' : 'border-slate-100'}`}>
            <label className={`text-xs font-bold uppercase tracking-wider block ${isDark ? 'text-purple-300' : 'text-slate-600'}`}>
              Lab Deployment Assignments *
            </label>
            <p className={`text-[11px] font-medium -mt-1 mb-2.5 ${isDark ? 'text-purple-400' : 'text-slate-400'}`}>Select laboratories where this software will be installed.</p>
            
            <div className={`grid grid-cols-2 gap-3 border p-4 rounded-xl ${isDark ? 'bg-[#0f0520] border-purple-500/10' : 'bg-slate-50 border-slate-100'}`}>
              {labs.map(lab => {
                const isChecked = selectedLabs.includes(lab.id);
                return (
                  <label 
                    key={lab.id} 
                    className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all cursor-pointer select-none ${
                      isChecked 
                        ? (isDark ? 'bg-[#c89b2a]/10 border-[#c89b2a]/30 text-[#c89b2a] font-bold' : 'bg-purple-50/50 border-[#4a0080]/30 text-[#4a0080] font-bold')
                        : (isDark ? 'bg-white/5 border-purple-500/10 text-purple-200 hover:bg-white/10' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50')
                    }`}
                  >
                    <input 
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleLabToggle(lab.id)}
                      className="rounded border-slate-300 text-[#4a0080] focus:ring-[#4a0080] w-4 h-4"
                    />
                    <span className="text-xs">{lab.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-3">
            <button 
              type="button"
              onClick={onClose}
              className={`flex-1 font-bold py-3 rounded-xl transition-all text-sm ${isDark ? 'bg-white/10 text-purple-200 hover:bg-white/15 border border-purple-500/20' : 'bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700'}`}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 bg-[#4a0080] hover:bg-purple-900 text-white font-bold py-3 rounded-xl shadow-md transition-all active:scale-[0.98] text-sm flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                'Save Software'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
