import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateProfile } from '../../store/slices/authSlice';
import { setProfileModalOpen } from '../../store/slices/uiSlice';
import { Modal } from '../../components/ui/modal';
import { addToast } from '../../store/slices/toastSlice';
import { X, Camera, Save, User as UserIcon, Mail } from 'lucide-react';
import { cn } from '../../lib/utils';

const PRESET_AVATAR_COLORS = [
  'bg-stone', 'bg-cobalt', 'bg-moss', 'bg-amber', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
];

export function ProfileModal() {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector(state => state.auth);
  const { isProfileModalOpen } = useAppSelector(state => state.ui);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  
  // Use avatar as a color class if it starts with 'bg-', else just a regular avatar (emoji/initials)
  // For simplicity, we allow typing emoji or initials
  const [avatarInput, setAvatarInput] = useState('');

  useEffect(() => {
    if (currentUser && isProfileModalOpen) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setAvatar(currentUser.avatar || '');
      setAvatarInput(currentUser.avatar && !currentUser.avatar.startsWith('bg-') ? currentUser.avatar : '');
    }
  }, [currentUser, isProfileModalOpen]);

  if (!currentUser) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      dispatch(addToast({ message: 'Name and email are required', type: 'error' }));
      return;
    }

    dispatch(updateProfile({
      name: name.trim(),
      email: email.trim(),
      avatar: avatar
    }));

    dispatch(addToast({ message: 'Profile updated successfully', type: 'success' }));
    dispatch(setProfileModalOpen(false));
  };

  const isColorClass = (str: string) => str.startsWith('bg-');

  return (
    <Modal 
      isOpen={isProfileModalOpen} 
      onClose={() => dispatch(setProfileModalOpen(false))} 
      maxWidth="max-w-md"
    >
      <div className="flex flex-col h-full max-h-[85vh]">
        <div className="flex items-center justify-between p-4 border-b border-line shrink-0">
          <h2 className="text-lg font-semibold text-ink">Profile Settings</h2>
          <button 
            onClick={() => dispatch(setProfileModalOpen(false))}
            className="p-1.5 text-ink-soft hover:text-ink hover:bg-stone/10 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-paper shadow-sm relative overflow-hidden",
              isColorClass(avatar) ? avatar : "bg-stone/20 text-ink"
            )}>
              {isColorClass(avatar) ? name.charAt(0).toUpperCase() : (avatarInput || name.charAt(0).toUpperCase())}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="w-full space-y-3">
              <label className="text-sm font-medium text-ink-soft block">Avatar Appearance</label>
              
              <div className="flex flex-wrap gap-2">
                {PRESET_AVATAR_COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => { setAvatar(color); setAvatarInput(''); }}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-transform",
                      color,
                      avatar === color ? "border-ink scale-110" : "border-transparent hover:scale-110"
                    )}
                  />
                ))}
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Or use an emoji / initials..."
                  value={avatarInput}
                  maxLength={2}
                  onChange={(e) => {
                    setAvatarInput(e.target.value);
                    setAvatar(e.target.value);
                  }}
                  className="w-full px-3 py-1.5 text-sm bg-transparent border border-line rounded-md focus:border-cobalt focus:ring-1 focus:ring-cobalt focus:outline-none placeholder:text-stone text-ink"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-ink flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-ink-soft" />
                Display Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-transparent border border-line rounded-md focus:border-cobalt focus:ring-1 focus:ring-cobalt focus:outline-none text-ink placeholder:text-stone"
                placeholder="John Doe"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-ink flex items-center gap-2">
                <Mail className="w-4 h-4 text-ink-soft" />
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-transparent border border-line rounded-md focus:border-cobalt focus:ring-1 focus:ring-cobalt focus:outline-none text-ink placeholder:text-stone"
                placeholder="john@example.com"
              />
            </div>
          </div>
        </form>

        <div className="p-4 border-t border-line shrink-0 flex justify-end gap-3">
          <button 
            type="button"
            onClick={() => dispatch(setProfileModalOpen(false))}
            className="px-4 py-2 text-sm font-medium text-ink-soft hover:text-ink hover:bg-stone/10 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-cobalt hover:bg-cobalt-dark text-white rounded-md text-sm font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
}
