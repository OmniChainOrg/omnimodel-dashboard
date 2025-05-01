'use client'

import { useEffect, useState } from 'react'

interface Validator {
  moniker: string
  public_key: string
  plugins: string[]
  zone?: string
  last_sync?: string
}

export default function ValidatorExplorer() {
  const [validators, setValidators] = useState<Validator[]>([])

  useEffect(() => {
    fetch('/validators.json')
      .then(res => res.json())
      .then(data => setValidators(data))
  }, [])

  return (
    <section className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-primary">🛰 Validators</h2>
      {validators.map((v, i) => (
        <div
          key={i}
          className="card border border-gray-200 rounded-xl p-4 shadow-sm bg-white"
        >
          <h3 className="text-lg font-semibold text-foreground">{v.moniker}</h3>
          <p className="text-sm text-gray-700">Zone: {v.zone || 'Unassigned'}</p>
          <p className="text-sm text-gray-700">Plugins: {v.plugins.join(', ')}</p>
          <p className="text-xs text-gray-500 break-all mt-2">PubKey: {v.public_key}</p>
          {v.last_sync && <p className="text-xs text-green-600 mt-1">Last sync: {v.last_sync}</p>}
        </div>
      ))}
    </section>
  )
}
