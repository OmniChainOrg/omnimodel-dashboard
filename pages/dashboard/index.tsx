import { useRouter } from 'next/router';
import { ZoneRegistry } from '@/lib/zoneRegistry';
import MemoryPanel from '@/components/MemoryPanel';

export default function Dashboard() {
  const router = useRouter();
  const zoneId = router.query.zone as string;

  const zone = ZoneRegistry.find(z => z.id === zoneId) ?? null;

  return (
    <>
      {/* … votre UI principale … */}
      <MemoryPanel zone={zone} />
    </>
  );
}
