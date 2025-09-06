import React from 'react';

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.FC<{ className?: string }>;
}

export interface StoryResult {
  title: string;
  text: string;
  moral: string;
  imageUrl: string;
}
