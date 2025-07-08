export const ZoneRegistry = [
  {
    id: 'omnitwin',
    name: 'OmniTwin',
    path: '/dashboard/omnitwin',
    approved: true,
    depth: 1
  },
  {
    id: 'hopechain',
    name: 'HOPEChain',
    path: '/dashboard/hopechain',
    approved: true,
    depth: 1
  },
  // ✅ Biotech zone (depth 1)
  {
    id: 'bio-rnd',
    name: '🧬 Biotech R&D',
    path: '/dashboard/biotech-rnd',
    approved: true,
    depth: 1
  },
  // ✅ Sub-zone for therapeutic vaccines (depth 2)
  {
    id: 'thera-vax',
    name: '💉 Therapeutic Vaccines: TNBC & KRAS',
    path: '/dashboard/thera-vaccines',
    approved: true,
    depth: 2
  },
  // ✅ RegOps zone (depth 1)
  {
    id: 'regops-center',
    name: '📋 RegOps Command Center',
    path: '/dashboard/regops',
    approved: true,
    depth: 1
  },
  // ✅ Optional fallback root zone (depth 0)
  {
    id: 'root',
    name: '🧠 Root Memory Zone',
    path: '/memory',
    approved: true,
    depth: 0
  }
];
