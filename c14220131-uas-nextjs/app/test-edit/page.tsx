'use client'

import { useState } from 'react'

export default function TestEditPage() {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('Test Name')

  console.log('TestEditPage render - editing:', editing)

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Test Edit Functionality</h1>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Current editing state: <strong>{editing ? 'TRUE' : 'FALSE'}</strong>
            </p>
            
            <button
              onClick={() => {
                console.log('Button clicked - before:', editing)
                setEditing(!editing)
                console.log('Button clicked - after setEditing called')
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Toggle Edit (Currently: {editing ? 'ON' : 'OFF'})
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Test Input
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!editing}
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Disabled: {!editing ? 'YES' : 'NO'}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded">
            <p className="text-sm">
              <strong>Instructions:</strong>
            </p>
            <ol className="text-sm list-decimal list-inside space-y-1 mt-2">
              <li>Click "Toggle Edit" button</li>
              <li>State should change from FALSE to TRUE</li>
              <li>Input should become enabled (white background)</li>
              <li>You should be able to type in the input</li>
            </ol>
          </div>

          <div className="p-4 bg-blue-50 rounded">
            <p className="text-sm">
              <strong>Debug Info:</strong>
            </p>
            <ul className="text-xs space-y-1 mt-2 font-mono">
              <li>editing: {String(editing)}</li>
              <li>name: {name}</li>
              <li>input disabled: {String(!editing)}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
