import React from 'react';
import { IconSparkles } from '@/components/icons';
import { iconMap } from '@/components/icons';
import { Card } from '@/components/ui';
import { TEMPLATES } from '@/data/templates';

interface LibraryViewProps {
  openTemplate: (id: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ openTemplate }) => (
  <div className="max-w-5xl mx-auto px-8 py-8">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-slate-900">Template library</h1>
      <p className="text-slate-500 text-sm mt-1">
        Curated AI workflows for advisors. Click any template to start a fresh conversation.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {TEMPLATES.map(tpl => {
        const IconC = iconMap[tpl.icon] || IconSparkles;

        return (
          <Card
            key={tpl.id}
            className="p-5 hover:elev-2 hover:-translate-y-0.5 transition cursor-pointer ripple"
            onClick={() => openTemplate(tpl.id)}
          >
            {/* Icon */}
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${tpl.accent}15` }}
            >
              <IconC size={18} stroke={tpl.accent} sw={2} />
            </div>

            {/* Title */}
            <div className="font-semibold text-slate-900 text-[14px] mb-1">
              {tpl.title}
            </div>

            {/* Hint */}
            <div className="text-[12.5px] text-slate-500 mb-3">
              {tpl.hint}
            </div>

            {/* Sample quote */}
            <div
              className="text-[12px] italic text-slate-400 border-l-2 pl-2"
              style={{ borderColor: `${tpl.accent}40` }}
            >
              &ldquo;{tpl.sample}&rdquo;
            </div>
          </Card>
        );
      })}
    </div>
  </div>
);
