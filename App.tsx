
import React from 'react';
import Sidebar from './components/Sidebar';
import StorytellerPage from './components/StorytellerPage';

const App: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-brand-bg">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-8 md:p-12">
        <StorytellerPage />
      </main>
    </div>
  );
};

export default App;
