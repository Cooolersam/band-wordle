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

  const renderWordSchedule = () => {
    // Calculate dates for each word based on the actual list
    const startDate = new Date('2025-08-28')
    const wordList = [
      'MUSIEL', 'GUITAR', 'GIBSON', 'BALLET', 'STAFFS', 'TREBLE', 'CHORUS', 'LEGATO',
      'RHYTHM', 'MELODY', 'BRIDGE', 'ACCENT', 'OCTAVE', 'ENCORE', 'PHRASE', 'MANUAL', 'FUSSEL',
      'REGGAE', 'TECHNO', 'COUNTRY', 'OPERA', 'BALLET', 'FLUTES',
      'SONATA', 'TUNING', 'UNISON', 'VOLUME', 'DECAPO', 'STUDIO', 'BALLAD', 'ANTHEM'
    ]
    
    const wordDates = wordList.map((word, index) => {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + index)
      return {
        word,
        date: date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        shortDate: date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      }
    })

    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-blue-800 mb-4 font-display">Word Schedule</h3>
          <p className="text-sm text-blue-600 mb-4 font-body">
            Start Date: August 28, 2025 | Total Words: {wordList.length}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wordDates.map((item, index) => (
              <div key={index} className="bg-white p-3 rounded-lg border border-blue-200">
                <div className="font-bold text-blue-900 text-lg font-body">{item.word}</div>
                <div className="text-sm text-blue-600 font-body">{item.shortDate}</div>
                <div className="text-xs text-blue-500 font-body">{item.date}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h4 className="font-semibold text-amber-800 mb-3 font-body">Current Status</h4>
          <div className="text-sm text-amber-600 font-body space-y-1">
            <p>• Start Date: August 28, 2025</p>
            <p>• Current Word List: {wordList.length} words</p>
            <p>• List ends: {wordDates[wordDates.length - 1]?.date}</p>
            <p>• Next words needed: Starting {new Date(new Date(wordDates[wordDates.length - 1]?.date).getTime() + 24*60*60*1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto p-8 bg-white rounded-2xl shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 font-display">
            Admin Panel
          </h1>
          <button
            onClick={onBackToGame}
            className="btn-secondary font-body"
          >
            ← Back to Game
          </button>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl font-body ${
            message.includes('Error') ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-green-50 text-green-800 border border-green-200'
          }`}>
            {message}
          </div>
        )}

        {/* Duplicate Prevention Info */}
        <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2 font-body">Duplicate Prevention Active</h3>
          <p className="text-sm text-blue-600 font-body">
            The system now prevents duplicate submissions for the same person on the same day. 
            If someone tries to submit multiple times, only their best score (lowest guesses) is kept.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('scores')}
            className={`tab-button font-body ${activeTab === 'scores' ? 'active' : 'inactive'}`}
          >
            Scores Management
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`tab-button font-body ${activeTab === 'schedule' ? 'active' : 'inactive'}`}
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