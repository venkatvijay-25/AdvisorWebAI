import React from 'react';
import { IconSparkles, IconChat, IconBell, type IcoProps } from '@/components/icons';
import { Badge, Button, Card, SectionTitle } from '@/components/ui';

interface ComingSoonViewProps {
  icon: React.FC<IcoProps>;
  title: string;
  pitch: string;
  bullets: string[];
  eta?: string;
}

export const ComingSoonView: React.FC<ComingSoonViewProps> = ({
  icon: IconC,
  title,
  pitch,
  bullets,
  eta = 'v4.1',
}) => (
  <div className="max-w-3xl mx-auto px-8 py-10">
    <div className="flex items-start gap-4 mb-6">
      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-500 elev-brand flex items-center justify-center shrink-0">
        <IconC size={24} stroke="#fff" sw={2.2} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <Badge tone="purple">Preview</Badge>
        </div>
        <p className="text-slate-500 text-sm mt-1">{pitch}</p>
      </div>
      <Badge tone="warn">Ships {eta}</Badge>
    </div>

    <Card className="p-5 mb-5">
      <SectionTitle icon={IconSparkles} title="What it will do" />
      <ul className="space-y-2.5">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2.5 text-[13.5px] text-slate-700 leading-relaxed">
            <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-brand-500 shrink-0" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </Card>

    <Card className="p-5 bg-gradient-to-r from-slate-50 to-white">
      <SectionTitle icon={IconChat} title="Shape this with us" />
      <div className="text-[13px] text-slate-600 mb-3">
        This surface is a preview. Tell us what would make it actually useful for your workflow and we'll
        include it in the next release.
      </div>
      <div className="flex gap-2">
        <Button kind="primary" icon={IconChat}>Share feedback</Button>
        <Button kind="secondary" icon={IconBell}>Notify me when live</Button>
      </div>
    </Card>
  </div>
);
