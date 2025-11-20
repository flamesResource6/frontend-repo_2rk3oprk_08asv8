import { useEffect, useState } from 'react'
import Header from './components/Header'
import SubjectCard from './components/SubjectCard'
import ChapterList from './components/ChapterList'

function App() {
  const [loading, setLoading] = useState(true)
  const [subjects, setSubjects] = useState([])
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [chapters, setChapters] = useState([])

  const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API}/api/subjects`)
        const data = await res.json()
        setSubjects(data)
      } catch (e) {
        setError('Unable to load subjects. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const openSubject = async (subject) => {
    setSelected(subject)
    setChapters([])
    try {
      const res = await fetch(`${API}/api/subjects/${subject.id}/chapters`)
      const data = await res.json()
      setChapters(data)
    } catch (e) {
      setError('Unable to load chapters.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_35%),radial-gradient(circle_at_70%_80%,rgba(14,165,233,0.08),transparent_40%)]" />
      <div className="relative max-w-md mx-auto">
        <Header title="Study Hub" subtitle="Maharashtra HSC • Std 12" />

        <main className="px-4 pb-10">
          {loading && (
            <div className="text-center text-blue-200/80 py-16">Loading...</div>
          )}
          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-red-200 text-sm">{error}</div>
          )}

          {!loading && !selected && (
            <div className="space-y-3">
              {subjects.map((s) => (
                <SubjectCard key={s.id} subject={s} onClick={() => openSubject(s)} />
              ))}
            </div>
          )}

          {!loading && selected && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <button onClick={() => setSelected(null)} className="text-blue-300 hover:text-blue-200">← Back</button>
                <div className="text-white font-semibold">{selected.name}</div>
              </div>
              <ChapterList chapters={chapters} onBack={() => setSelected(null)} />
            </div>
          )}
        </main>

        <footer className="px-4 pb-8 text-center text-xs text-blue-300/60">
          Tip: Add to Home Screen from your browser for a mobile app feel.
        </footer>
      </div>
    </div>
  )
}

export default App
