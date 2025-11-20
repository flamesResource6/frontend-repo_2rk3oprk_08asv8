import React from 'react'

export default function ChapterList({ chapters, onBack }) {
  return (
    <div className="space-y-3">
      <button onClick={onBack} className="text-sm text-blue-300 hover:text-blue-200 mb-2">← Back to subjects</button>
      {chapters.map((ch) => (
        <div key={ch.id} className="rounded-xl border border-blue-500/20 bg-slate-800/40 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 h-8 w-8 flex items-center justify-center rounded-lg bg-blue-500/10 ring-1 ring-blue-400/30 text-blue-300 font-semibold">
              {ch.number}
            </div>
            <div>
              <h4 className="text-white font-medium">{ch.title}</h4>
              {ch.summary && <p className="text-blue-200/70 text-sm mt-1">{ch.summary}</p>}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
