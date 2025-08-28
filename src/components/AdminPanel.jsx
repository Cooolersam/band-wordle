import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

const AdminPanel = ({ onBackToGame }) => {
  const [allScores, setAllScores] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [filterNickname, setFilterNickname] = useState('')

  useEffect(() => {
    loadAllScores()
  }, [])

  const loadAllScores = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('scores')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAllScores(data || [])
    } catch (error) {
      console.error('Error loading scores:', error)
      setMessage('Error loading scores')
    } finally {
      setLoading(false)
    }
  }

  const deleteScore = async (scoreId) => {
    if (!confirm('Are you sure you want to delete this score?')) return

    try {
      const { error } = await supabase
        .from('scores')
        .delete()
        .eq('id', scoreId)

      if (error) throw error
      
      setMessage('Score deleted successfully')
      loadAllScores() // Reload the list
      
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error deleting score:', error)
      setMessage('Error deleting score')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const filteredScores = allScores.filter(score => {
    const matchesDate = !filterDate || score.date === filterDate
    const matchesNickname = !filterNickname || 
      score.nickname.toLowerCase().includes(filterNickname.toLowerCase())
    return matchesDate && matchesNickname
  })

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto p-8 bg-white rounded-2xl shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <button
            onClick={onBackToGame}
            className="btn-secondary"
          >
            ← Back to Game
          </button>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl ${
            message.includes('Error') ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-green-50 text-green-800 border border-green-200'
          }`}>
            {message}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Date
              </label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Nickname
              </label>
              <input
                type="text"
                value={filterNickname}
                onChange={(e) => setFilterNickname(e.target.value)}
                placeholder="Search nicknames..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Scores Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nickname
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Section
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guesses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Solved
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading scores...</p>
                  </td>
                </tr>
              ) : filteredScores.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No scores found
                  </td>
                </tr>
              ) : (
                filteredScores.map((score) => (
                  <tr key={score.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(score.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {score.nickname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {score.section}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        score.solved 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {score.guesses}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {score.solved ? '✅' : '❌'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => deleteScore(score.id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-sm text-gray-500 text-center">
          Total scores: {filteredScores.length} of {allScores.length}
        </div>

        {/* Word Schedule Section */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <h2 className="text-2xl font-bold mb-4 text-blue-800">Word Schedule</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-blue-700">August 2025</h3>
              <div className="space-y-1 text-sm">
                <div>28 - MUSIEL</div>
                <div>29 - GUITAR</div>
                <div>30 - GIBSON</div>
                <div>31 - BALLET</div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-blue-700">September 2025</h3>
              <div className="space-y-1 text-sm">
                <div>1 - STAFFS</div>
                <div>2 - TREBLE</div>
                <div>3 - CHORUS</div>
                <div>4 - LEGATO</div>
                <div>5 - RHYTHM</div>
                <div>6 - MELODY</div>
                <div>7 - BRIDGE</div>
                <div>8 - ACCENT</div>
                <div>9 - OCTAVE</div>
                <div>10 - ENCORE</div>
                <div>11 - PHRASE</div>
                <div>12 - MANUAL</div>
                <div>13 - FUSSEL</div>
                <div>14 - REGGAE</div>
                <div>15 - TECHNO</div>
                <div>16 - COUNTRY</div>
                <div>17 - OPERA</div>
                <div>18 - BALLET</div>
                <div>19 - CLASSICAL</div>
                <div>20 - SONATA</div>
                <div>21 - TUNING</div>
                <div>22 - UNISON</div>
                <div>23 - VOLUME</div>
                <div>24 - DECAPO</div>
                <div>25 - STUDIO</div>
                <div>26 - BALLAD</div>
                <div>27 - ANTHEM</div>
                <div>28 - [Next word to be added]</div>
                <div>29 - [Next word to be added]</div>
                <div>30 - [Next word to be added]</div>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This is NOT a cycling list. New words will be added over time. 
              When you run out of ideas, you may loop back but in random order.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel 