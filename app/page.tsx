'use client';

import { VideoGenerator } from '@/components/video-generator';
import { Header } from '@/components/header';
import { History } from '@/components/history';
import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'generator' | 'history'>('generator');

  return (
    <div className="min-h-screen">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'generator' ? <VideoGenerator /> : <History />}
      </main>
    </div>
  );
}