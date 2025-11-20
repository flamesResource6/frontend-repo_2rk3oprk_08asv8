import React, { useEffect, useState } from 'react'

export default function ChapterList({ chapters, onBack }) {
  const [expanded, setExpanded] = useState(null)
  const [topics, setTopics] = useState({})
  const [mcqs, setMcqs] = useState({})
  const [answers, setAnswers] = useState({})
  const [noteDrafts, setNoteDrafts] = useState({})
  const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const toggle = async (ch) => {
    const key = ch.id
    const isOpen = expanded === key
    setExpanded(isOpen ? null : key)
    if (isOpen) return
    // Load topics and mcqs when opening
    try {
      const [tRes, qRes] = await Promise.all([
        fetch(`${API}/api/chapters/${key}/topics`),
        fetch(`${API}/api/chapters/${key}/mcqs`)
      ])
      const [tData, qData] = await Promise.all([tRes.json(), qRes.json()])
      setTopics((prev) => ({ ...prev, [key]: tData }))
      setMcqs((prev) => ({ ...prev, [key]: qData }))
    } catch (e) {
      // ignore
    }
  }

  const submitNote = async (ch) => {
    const key = ch.id
    const draft = noteDrafts[key]
    if (!draft || !draft.title || !draft.body) return
    try {
      const res = await fetch(`${API}/api/chapters/${key}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft)
      })
      if (!res.ok) {
        alert('Notes require database. Please connect DB to save personal notes.')
        return
      }
      const saved = await res.json()
      setNoteDrafts((p) => ({ ...p, [key]: { title: '', body: '' } }))
      alert('Note saved!')
    } catch (e) {
      alert('Unable to save note right now.')
    }
  }

  const checkAnswer = async (chapterId, mcq) => {
    try {
      const res = await fetch(`${API}/api/chapters/${chapterId}/mcqs/${mcq.id}/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer_index: answers[mcq.id] ?? -1 })
      })
      const data = await res.json()
      setMcqs((prev) => ({
        ...prev,
        [chapterId]: prev[chapterId].map((q) => q.id === mcq.id ? { ...q, _result: data.correct } : q)
      }))
    } catch (e) {
      // ignore
    }
  }

  return (
    <div className="space-y-3">
      <button onClick={onBack} className="text-sm text-blue-300 hover:text-blue-200 mb-2">← Back to subjects</button>
      {chapters.map((ch) => (
        <div key={ch.id} className="rounded-xl border border-blue-500/20 bg-slate-800/40 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 h-8 w-8 flex items-center justify-center rounded-lg bg-blue-500/10 ring-1 ring-blue-400/30 text-blue-300 font-semibold">
              {ch.number}
            </div>
            <div className="flex-1">
              <h4 className="text-white font-medium">{ch.title}</h4>
              {ch.summary && <p className="text-blue-200/70 text-sm mt-1">{ch.summary}</p>}
            </div>
            <button onClick={() => toggle(ch)} className="text-blue-300 hover:text-blue-200 text-sm">{expanded === ch.id ? 'Hide' : 'Open'}</button>
          </div>

          {expanded === ch.id && (
            <div className="mt-4 space-y-5">
              {/* Topics */}
              <div>
                <h5 className="text-blue-200 font-semibold mb-2">Quick Topics</h5>
                <ul className="space-y-2">
                  {(topics[ch.id] || []).map((t) => (
                    <li key={t.id} className="rounded-lg bg-slate-900/40 p-3 border border-blue-500/10">
                      <div className="text-white text-sm font-medium">{t.title}</div>
                      {t.content && <p className="text-blue-200/70 text-xs mt-1">{t.content}</p>}
                    </li>
                  ))}
                  {(!topics[ch.id] || topics[ch.id].length === 0) && (
                    <li className="text-blue-200/60 text-sm">No topics yet.</li>
                  )}
                </ul>
              </div>

              {/* Notes */}
              <div>
                <h5 className="text-blue-200 font-semibold mb-2">Your Notes</h5>
                <div className="grid grid-cols-1 gap-2">
                  <input
                    className="w-full rounded-md bg-slate-900/50 border border-blue-500/20 px-3 py-2 text-sm text-white placeholder-blue-200/50"
                    placeholder="Note title"
                    value={noteDrafts[ch.id]?.title || ''}
                    onChange={(e) => setNoteDrafts((p) => ({ ...p, [ch.id]: { ...(p[ch.id]||{}), title: e.target.value } }))}
                  />
                  <textarea
                    className="w-full rounded-md bg-slate-900/50 border border-blue-500/20 px-3 py-2 text-sm text-white placeholder-blue-200/50 min-h-[80px]"
                    placeholder="Write quick notes..."
                    value={noteDrafts[ch.id]?.body || ''}
                    onChange={(e) => setNoteDrafts((p) => ({ ...p, [ch.id]: { ...(p[ch.id]||{}), body: e.target.value } }))}
                  />
                  <button onClick={() => submitNote(ch)} className="justify-self-start rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm px-3 py-1.5">Save Note</button>
                  <p className="text-xs text-blue-300/60">Notes save only when a database is connected.</p>
                </div>
              </div>

              {/* MCQs */}
              <div>
                <h5 className="text-blue-200 font-semibold mb-2">Practice MCQs</h5>
                <div className="space-y-3">
                  {(mcqs[ch.id] || []).map((q, i) => (
                    <div key={q.id} className="rounded-lg bg-slate-900/40 p-3 border border-blue-500/10">
                      <div className="text-white text-sm font-medium">Q{i+1}. {q.question}</div>
                      <div className="mt-2 grid grid-cols-1 gap-2">
                        {q.options.map((opt, idx) => (
                          <label key={idx} className={`flex items-center gap-2 rounded-md border px-2 py-1.5 text-sm cursor-pointer transition-colors ${answers[q.id]===idx ? 'border-blue-400 bg-blue-500/10 text-white' : 'border-blue-500/20 text-blue-200/80 hover:border-blue-400/40'}`}>
                            <input
                              type="radio"
                              name={`mcq-${q.id}`}
                              className="accent-blue-500"
                              checked={answers[q.id] === idx}
                              onChange={() => setAnswers((p) => ({ ...p, [q.id]: idx }))}
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <button onClick={() => checkAnswer(ch.id, q)} className="rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-2 py-1">Check</button>
                        {q._result === true && <span className="text-emerald-400 text-xs">Correct ✅</span>}
                        {q._result === false && <span className="text-rose-400 text-xs">Try again ❌</span>}
                      </div>
                    </div>
                  ))}
                  {(!mcqs[ch.id] || mcqs[ch.id].length === 0) && (
                    <p className="text-blue-200/60 text-sm">No MCQs yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
