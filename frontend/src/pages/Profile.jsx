import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Mail, Settings, Moon, Sun, User, Scale, Activity, Save, Camera } from 'lucide-react';

export default function Profile() {
  const { user, theme, toggleTheme } = useContext(AuthContext);

  // Generate unique user key based on email to prevent data bleeding across accounts
  const userKey = user?.email ? user.email.replace(/[^a-zA-Z0-9]/g, '_') : 'guest';
  const profileStorageKey = `userProfileData_${userKey}`;
  const profilePicKey = `userProfilePic_${userKey}`;
  const weightHistoryKey = `userWeightHistory_${userKey}`;

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    age: '',
    phone: '',
    height: '', // cm me
    weight: '', // kg me
    goalWeight: '', // kg me
  });

  const [profilePic, setProfilePic] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // Load existing user-specific profile and avatar from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem(profileStorageKey);
    if (savedProfile) {
      try {
        setFormData(JSON.parse(savedProfile));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Reset form if switching to a new user with no saved profile yet
      setFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        age: '',
        phone: '',
        height: '',
        weight: '',
        goalWeight: '',
      });
    }

    const savedPic = localStorage.getItem(profilePicKey);
    if (savedPic) {
      setProfilePic(savedPic);
    } else {
      setProfilePic('');
    }
  }, [userKey, profileStorageKey, profilePicKey]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle avatar image selection from local file system
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setProfilePic(result);
        localStorage.setItem(profilePicKey, result);
      };
      reader.readAsDataURL(file);
    }
  };

  // BMI Calculation: Weight (kg) / (Height (m))^2
  const calculateBMI = () => {
    const hInMeters = Number(formData.height) / 100;
    const w = Number(formData.weight);
    if (hInMeters > 0 && w > 0) {
      const bmi = (w / (hInMeters * hInMeters)).toFixed(1);
      let category = '';
      if (bmi < 18.5) category = 'Underweight';
      else if (bmi < 24.9) category = 'Normal';
      else if (bmi < 29.9) category = 'Overweight';
      else category = 'Obese';
      return { value: bmi, category };
    }
    return { value: '--', category: 'Not calculated' };
  };

  const bmiData = calculateBMI();

  const handleSave = (e) => {
    e.preventDefault();
    // Save profile data specific to current user
    localStorage.setItem(profileStorageKey, JSON.stringify(formData));

    // Maintain user-specific weight history for analytics graphs
    const existingHistory = JSON.parse(localStorage.getItem(weightHistoryKey) || '[]');
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    if (formData.weight) {
      const newEntry = { date: today, weight: Number(formData.weight) };
      const updatedHistory = existingHistory.filter((item) => item.date !== today);
      updatedHistory.push(newEntry);
      localStorage.setItem(weightHistoryKey, JSON.stringify(updatedHistory));
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const setMode = (mode) => {
    if (mode !== theme) toggleTheme();
  };

  const displayName = `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim() || user?.name || 'Athlete User';

  return (
    <div className="w-full min-h-[calc(100vh-65px)] bg-paper dark:bg-ink-dark text-ink dark:text-paper-dark px-6 lg:px-12 py-8 transition-colors duration-200">
      <div className="w-full space-y-8">
        
        {/* Profile Card Header */}
        <div className="bg-paper-raised dark:bg-surface-dark border border-line dark:border-line-dark rounded-xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-line dark:border-line-dark">
            <div className="flex items-center gap-4">
              
              {/* Clickable Avatar with Camera Overlay */}
              <div 
                className="relative group cursor-pointer" 
                onClick={() => fileInputRef.current.click()}
                title="Click to change profile picture"
              >
                <div className="w-16 h-16 rounded-xl bg-flame flex items-center justify-center text-white font-display font-semibold text-2xl uppercase overflow-hidden border border-flame/30 shadow-sm">
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    formData.firstName?.[0] || user?.name?.[0] || 'A'
                  )}
                </div>
                <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                  <Camera size={20} />
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              <div>
                <h2 className="font-display text-xl font-semibold">{displayName}</h2>
                <p className="text-xs text-ink-soft dark:text-ink-soft-dark flex items-center gap-1 mt-1 font-mono">
                  <Mail size={13} /> {user?.email || 'student@college.edu'}
                </p>
              </div>
            </div>

            {/* BMI Display Widget */}
            <div className="flex items-center gap-4 bg-paper dark:bg-ink-dark border border-line dark:border-line-dark px-4 py-3 rounded-lg">
              <div className="p-2 bg-flame-soft dark:bg-flame-soft-dark rounded text-flame">
                <Activity size={20} />
              </div>
              <div>
                <p className="text-[10px] font-mono text-ink-soft dark:text-ink-soft-dark uppercase font-semibold">Calculated BMI</p>
                <p className="text-lg font-mono font-bold text-ink dark:text-paper-dark">
                  {bmiData.value} <span className="text-xs font-normal text-flame">({bmiData.category})</span>
                </p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSave} className="pt-6 space-y-6">
            <h3 className="text-sm font-display font-semibold flex items-center gap-2">
              <User size={16} className="text-flame" /> Personal Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-mono font-semibold text-ink-soft dark:text-ink-soft-dark">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full mt-1 bg-paper dark:bg-ink-dark border border-line dark:border-line-dark px-3 py-2 rounded-md text-sm focus:outline-none focus:border-flame"
                />
              </div>
              <div>
                <label className="text-xs font-mono font-semibold text-ink-soft dark:text-ink-soft-dark">Middle Name</label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  placeholder="M."
                  className="w-full mt-1 bg-paper dark:bg-ink-dark border border-line dark:border-line-dark px-3 py-2 rounded-md text-sm focus:outline-none focus:border-flame"
                />
              </div>
              <div>
                <label className="text-xs font-mono font-semibold text-ink-soft dark:text-ink-soft-dark">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full mt-1 bg-paper dark:bg-ink-dark border border-line dark:border-line-dark px-3 py-2 rounded-md text-sm focus:outline-none focus:border-flame"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono font-semibold text-ink-soft dark:text-ink-soft-dark">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="22"
                  className="w-full mt-1 bg-paper dark:bg-ink-dark border border-line dark:border-line-dark px-3 py-2 rounded-md text-sm focus:outline-none focus:border-flame"
                />
              </div>
              <div>
                <label className="text-xs font-mono font-semibold text-ink-soft dark:text-ink-soft-dark">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full mt-1 bg-paper dark:bg-ink-dark border border-line dark:border-line-dark px-3 py-2 rounded-md text-sm focus:outline-none focus:border-flame"
                />
              </div>
            </div>

            <h3 className="text-sm font-display font-semibold flex items-center gap-2 pt-4 border-t border-line dark:border-line-dark">
              <Scale size={16} className="text-flame" /> Body Metrics &amp; Target
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-mono font-semibold text-ink-soft dark:text-ink-soft-dark">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="175"
                  className="w-full mt-1 bg-paper dark:bg-ink-dark border border-line dark:border-line-dark px-3 py-2 rounded-md text-sm focus:outline-none focus:border-flame"
                />
              </div>
              <div>
                <label className="text-xs font-mono font-semibold text-ink-soft dark:text-ink-soft-dark">Current Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="70"
                  className="w-full mt-1 bg-paper dark:bg-ink-dark border border-line dark:border-line-dark px-3 py-2 rounded-md text-sm focus:outline-none focus:border-flame"
                />
              </div>
              <div>
                <label className="text-xs font-mono font-semibold text-ink-soft dark:text-ink-soft-dark">Goal Weight (kg)</label>
                <input
                  type="number"
                  name="goalWeight"
                  value={formData.goalWeight}
                  onChange={handleChange}
                  placeholder="65"
                  className="w-full mt-1 bg-paper dark:bg-ink-dark border border-line dark:border-line-dark px-3 py-2 rounded-md text-sm focus:outline-none focus:border-flame"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="submit"
                className="bg-flame hover:bg-flame/90 text-white font-semibold px-6 py-2.5 rounded-md text-sm transition flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Save size={16} /> Save Profile
              </button>
              {savedSuccess && (
                <span className="text-xs font-mono text-moss font-semibold">Profile &amp; Weight history saved successfully!</span>
              )}
            </div>
          </form>

          {/* Theme Switcher Section */}
          <div className="pt-8 mt-8 border-t border-line dark:border-line-dark space-y-4">
            <h3 className="text-sm font-display font-semibold flex items-center gap-2">
              <Settings size={16} className="text-flame" /> Interface &amp; Theme
            </h3>

            <div className="bg-paper dark:bg-ink-dark p-4 rounded-lg border border-line dark:border-line-dark flex justify-between items-center gap-4">
              <div>
                <h4 className="text-xs font-semibold">Appearance theme</h4>
                <p className="text-[11px] text-ink-soft dark:text-ink-soft-dark mt-0.5">Switch between dark mode and light mode</p>
              </div>

              <div className="flex bg-paper-raised dark:bg-surface-dark p-1 rounded-lg border border-line dark:border-line-dark">
                <button
                  onClick={() => setMode('dark')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-flame text-white'
                      : 'text-ink-soft dark:text-ink-soft-dark hover:text-ink dark:hover:text-paper-dark'
                  }`}
                >
                  <Moon size={14} /> Dark
                </button>
                <button
                  onClick={() => setMode('light')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    theme === 'light'
                      ? 'bg-flame text-white'
                      : 'text-ink-soft dark:text-ink-soft-dark hover:text-ink dark:hover:text-paper-dark'
                  }`}
                >
                  <Sun size={14} /> Light
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}