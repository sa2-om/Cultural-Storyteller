
import React from 'react';
import type { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  onSelect: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, isSelected, onSelect }) => {
  const { name, description, icon: Icon } = category;

  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
        isSelected
          ? 'bg-brand-yellow/10 border-brand-yellow'
          : 'bg-card-bg hover:bg-card-bg-hover border-transparent'
      }`}
    >
      <div className="flex flex-col items-start space-y-3">
        <div className="text-3xl"><Icon /></div>
        <h3 className="font-semibold text-white">{name}</h3>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
    </div>
  );
};

export default CategoryCard;
