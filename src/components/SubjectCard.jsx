import React from 'react'

export default function SubjectCard({ subject, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left rounded-2xl border border-blue-500/20 bg-slate-800/50 backdrop-blur-sm p-4 hover:border-blue-400/40 hover:bg-slate-800/70 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 ring-1 ring-blue-400/30 text-2xl">
          {subject.icon || '📘'}
        </div>
        <div className="flex-1">
          <h3 className="text-white font-semibold leading-tight">
            {subject.name}
          </h3>
          <p className="text-blue-200/70 text-sm mt-1">
            {subject.description || `${subject.board} • Std ${subject.standard}`}
          </p>
        </div>
        <div className="text-blue-300/70 group-hover:translate-x-0.5 transition-transform">→</div>
      </div>
    </button>
  )
}
