import React, { useState } from 'react';
import { IconSparkles, IconSend } from '@/components/icons';
import { Button } from '@/components/ui';

export interface FollowUpBarProps {
  suggestions: string[];
  onSend: (text: string) => void;
}

/**
 * FollowUpBar - Row of suggestion chips + text input for follow-ups
 */
export const FollowUpBar: React.FC<FollowUpBarProps> = ({ suggestions, onSend }) => {
  const [val, setVal] = useState('');

  const submit = () => {
    if (val.trim()) {
      onSend(val.trim());
      setVal('');
    }
  };

  return (
    <div className="sticky bottom-0 pt-6 pb-6 -mx-6 px-6 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
      <div className="flex flex-wrap gap-2 mb-3">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSend(s)}
            className="text-[12px] inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 ripple"
          >
            <IconSparkles size={11} stroke="#2FA4F9" sw={2.4} /> {s}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 elev-1 flex items-center px-3">
        <IconSparkles size={16} stroke="#2FA4F9" />
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Ask a follow-up, or type e.g. 'Show after-tax return'..."
          className="flex-1 px-3 py-3 text-[14px] outline-none placeholder:text-slate-400 bg-transparent"
        />
        <Button kind="primary" icon={IconSend} size="sm" onClick={submit}>
          Send
        </Button>
      </div>
    </div>
  );
};
