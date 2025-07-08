import { ZoneRegistry } from '@/lib/zoneRegistry'; // or '../lib/zoneRegistry' depending on file structure
import ZoneSubDashboard from '@/components/ZoneSubDashboard';

export default function Dashboard() {
  return (
    <>
      {ZoneRegistry.filter(z => z.approved).map((zone) => (
        <ZoneSubDashboard key={zone.name} zone={zone} />
      ))}
    </>
  );
}
