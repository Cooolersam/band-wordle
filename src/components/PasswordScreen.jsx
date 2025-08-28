import { useState } from 'react'

const PasswordScreen = ({ onPasswordCorrect, onCancel }) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === 'altotenor') {
      onPasswordCorrect()
    } else {
      setError('Incorrect password')
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
            Admin Access
          </h1>
          <p className="text-gray-600">Enter password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter password..."
              autoFocus
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-800 rounded-xl border border-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="flex space-x-3">
                          <button
                type="submit"
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-200"
              >
                Access Admin
              </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Press Ctrl + Shift + A again to access this screen
          </p>
        </div>
      </div>
    </div>
  )
}

export default PasswordScreen 