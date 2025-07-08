{ZoneRegistry.filter(z => z.approved).map((zone) => (
  <ZoneSubDashboard key={zone.name} zone={zone} />
))}
