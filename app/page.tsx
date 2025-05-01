'use client'

import SimulationAnchorFeed from './SimulationAnchorFeed'
import ValidatorExplorer from './ValidatorExplorer'

export default function Home() {
  return (
    <main className="p-8 space-y-8">
      <section>
        <h1 className="text-2xl font-bold text-primary">OmniModel Dashboard 🚀</h1>
        <p className="text-sm mt-4">Live subnet traces. Scientific trust, on-chain.</p>
      </section>

      <SimulationAnchorFeed />
      <ValidatorExplorer />
    </main>
  )
}
