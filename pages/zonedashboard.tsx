import React from 'react';
import { ZoneDashboard } from '../components/ZoneDashboard';

const ZoneDashboardPage: React.FC = () => (
  <div className="min-h-screen bg-gray-100 p-8">
    <ZoneDashboard archetypeId="root" archetypeName="Root Zone Archetype" />
  </div>
);

export default ZoneDashboardPage;
