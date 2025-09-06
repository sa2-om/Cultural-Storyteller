import React from 'react';
import { DashboardIcon, StorytellerIcon, CulturesIcon, MyStoriesIcon, SettingsIcon } from './Icons';

interface NavItemProps {
  icon: React.FC<{ className?: string }>;
  label: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active = false }) => {
  const baseClasses = 'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200';
  const activeClasses = 'bg-brand-yellow/20 text-brand-yellow';
  const inactiveClasses = 'text-gray-400 hover:bg-gray-700/50 hover:text-white';
  
  return (
    <a href="#" className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}>
      <Icon className="w-6 h-6" />
      <span>{label}</span>
    </a>
  );
};


const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-sidebar-bg p-6 flex-shrink-0 flex flex-col justify-between hidden md:flex">
      <div>
        <div className="flex items-center space-x-3 mb-10">
          <span className="text-3xl">🎭</span>
          <span className="text-white text-xl font-bold">Cultural Storyteller</span>
        </div>
        <nav className="space-y-2">
          <NavItem icon={DashboardIcon} label="Dashboard" />
          <NavItem icon={StorytellerIcon} label="Storyteller" active />
          <NavItem icon={CulturesIcon} label="Cultures" />
          <NavItem icon={MyStoriesIcon} label="My Stories" />
        </nav>
      </div>
      <div>
        <NavItem icon={SettingsIcon} label="Settings" />
      </div>
    </aside>
  );
};

export default Sidebar;