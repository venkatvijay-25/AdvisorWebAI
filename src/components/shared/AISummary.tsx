import React, { Fragment } from 'react';
import { useTypewriter } from '@/hooks';
import type { Source } from '@/types';

interface SummaryPiece {
  t: string;
  b?: boolean;
  cite?: number;
}

export interface AISummaryProps {
  pieces: SummaryPiece[];
  sources?: Source[];
}

/**
 * Citation - Inline citation chip with hover tooltip
 */
const Citation: React.FC<{ n: number; src: Source }> = ({ n, src }) => (
  <span className="cite" tabIndex={0}>
    {n}
    <span className="cite-tt">
      <div style={{ fontWeight: 600, marginBottom: 2 }}>{src.title}</div>
      <div style={{ opacity: 0.75 }}>
        {src.kind} &middot; {src.freshness}
      </div>
    </span>
  </span>
);

/**
 * AISummary - Streaming AI summary with typewriter effect
 * Shows a streaming text animation, then renders styled version with bold segments and citations
 */
export const AISummary: React.FC<AISummaryProps> = ({ pieces, sources }) => {
  const flat = pieces.map((p) => p.t).join('');
  const { shown, done } = useTypewriter(flat, { speed: 8 });

  if (!done) {
    return (
      <p className="text-[14px] text-slate-700 leading-relaxed">
        {shown}
        <span className="caret" />
      </p>
    );
  }

  return (
    <p className="text-[14px] text-slate-700 leading-relaxed fade-up">
      {pieces.map((p, i) => {
        const chunk = p.b ? (
          <span key={i} className="font-semibold text-slate-900">
            {p.t}
          </span>
        ) : (
          <Fragment key={i}>{p.t}</Fragment>
        );

        if (p.cite && sources && sources[p.cite - 1]) {
          return (
            <Fragment key={i}>
              {chunk}
              <Citation n={p.cite} src={sources[p.cite - 1]} />
            </Fragment>
          );
        }

        return chunk;
      })}
    </p>
  );
};
