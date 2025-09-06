
import type { Category } from './types';
import { FolkTalesIcon, HistoryIcon, TraditionsIcon, MythologyIcon, HeroesIcon, FestivalsIcon } from './components/Icons';

export const CATEGORIES: Category[] = [
  {
    id: 'folk-tales',
    name: 'Folk Tales',
    description: 'Traditional stories passed down through generations',
    icon: FolkTalesIcon,
  },
  {
    id: 'history',
    name: 'History',
    description: 'Historical events and figures brought to life',
    icon: HistoryIcon,
  },
  {
    id: 'traditions',
    name: 'Traditions',
    description: 'Cultural practices and ceremonies',
    icon: TraditionsIcon,
  },
  {
    id: 'mythology',
    name: 'Mythology',
    description: 'Ancient myths and legends',
    icon: MythologyIcon,
  },
  {
    id: 'heroes',
    name: 'Heroes',
    description: 'Legendary figures and their adventures',
    icon: HeroesIcon,
  },
  {
    id: 'festivals',
    name: 'Festivals',
    description: 'Cultural celebrations and their origins',
    icon: FestivalsIcon,
  },
];
