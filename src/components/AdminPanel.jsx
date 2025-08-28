import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

const AdminPanel = ({ onBackToGame }) => {
  const [allScores, setAllScores] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [filterNickname, setFilterNickname] = useState('')
  const [activeTab, setActiveTab] = useState('scores')

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

  const renderWordSchedule = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-xl font-bold text-blue-800 mb-4">Word Schedule Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-blue-700 mb-2">Current Status</h4>
            <ul className="space-y-1 text-sm text-blue-600">
              <li>• Start Date: August 28, 2025</li>
              <li>• Current Word List: 30 words</li>
              <li>• List ends: After ANTHEM (September 27)</li>
              <li>• Next words needed: Starting September 28</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-700 mb-2">Word Categories</h4>
            <ul className="space-y-1 text-sm text-blue-600">
              <li>• Instruments: GUITAR, GIBSON, PIANO</li>
              <li>• Music Terms: RHYTHM, MELODY, BRIDGE</li>
              <li>• Genres: REGGAE, TECHNO, COUNTRY</li>
              <li>• Band Related: STAGE, STUDIO, ANTHEM</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h4 className="font-semibold text-amber-800 mb-3">Quick Reference</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium text-amber-700">1st of month:</span><br/>
            <span className="text-amber-600">Usually STAFFS, BALLET, or GIBSON</span>
          </div>
          <div>
            <span className="font-medium text-amber-700">15th of month:</span><br/>
            <span className="text-amber-600">Usually REGGAE, TECHNO, or COUNTRY</span>
          </div>
          <div>
            <span className="font-medium text-amber-700">28th of month:</span><br/>
            <span className="text-amber-600">Usually ANTHEM, BALLAD, or STUDIO</span>
          </div>
          <div>
            <span className="font-medium text-amber-700">End of month:</span><br/>
            <span className="text-amber-600">Usually GIBSON, GUITAR, or MUSIEL</span>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <h4 className="font-semibold text-green-800 mb-3">Adding New Words</h4>
        <p className="text-sm text-green-700 mb-3">
          When you add new words to wordList.js, update this schedule accordingly.
        </p>
        <div className="text-xs text-green-600 space-y-1">
          <p>• Words should be exactly 6 letters long</p>
          <p>• All uppercase in the code</p>
          <p>• Music/band related</p>
          <p>• Update this admin panel when adding new words</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto p-8 bg-white rounded-2xl shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-900 to-slate-900 bg-clip-text text-transparent">
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

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('scores')}
            className={`tab-button ${activeTab === 'scores' ? 'active' : 'inactive'}`}
          >
            Scores Management
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`tab-button ${activeTab === 'schedule' ? 'active' : 'inactive'}`}
          >
            Word Schedule
          </button>
        </div>

        {/* Scores Tab */}
        {activeTab === 'scores' && (
          <>
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
          </>
        )}

        {/* Word Schedule Tab */}
        {activeTab === 'schedule' && renderWordSchedule()}
      </div>
    </div>
  )
}

export default AdminPanel 