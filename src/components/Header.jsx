import React from 'react'

export default function Header({ title = 'Study Hub', subtitle }) {
  return (
    <header className="px-4 pt-6 pb-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
          {subtitle && <p className="text-sm text-blue-200/80 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2 text-blue-200/80">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 ring-1 ring-blue-400/30">
            📚
          </span>
        </div>
      </div>
    </header>
  )
}
