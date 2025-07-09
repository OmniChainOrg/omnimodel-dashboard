// pages/memory/index.tsx
import MemoryPanel from '../../components/MemoryPanel';
import { ZoneRegistry } from '../../lib/zoneRegistry';

export default function MemoryPage() {
  // Utilise la vraie zone existante (peut être root, omnitwin, biotech-lab, etc.)
  const zone = ZoneRegistry.find((z) => z.id === 'root');

  if (!zone) {
    return <div className="text-red-500 p-4">❌ Zone "root" introuvable dans le registre.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Memory Panel</h1>
      <MemoryPanel zone={zone} />
    </div>
  );
}
