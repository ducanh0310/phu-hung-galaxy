import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  IconDefinition,
  faChevronDown,
  faCookieBite,
  faDolly,
  faPlus,
  faSearch,
  faSeedling,
  faShoppingCart,
  faStore,
  faTimes,
  faUtensils,
} from '@fortawesome/free-solid-svg-icons';

// A map to convert string names to FontAwesome icon objects
const iconMap: { [key: string]: IconDefinition } = {
  'chevron-down': faChevronDown,
  'cookie-bite': faCookieBite,
  dolly: faDolly,
  plus: faPlus,
  search: faSearch,
  seedling: faSeedling,
  'shopping-cart': faShoppingCart,
  store: faStore,
  times: faTimes,
  utensils: faUtensils,
};

// Helper to find the icon object from the name string (e.g., "fa-solid fa-search")
const getIcon = (name: string): IconDefinition | undefined => {
  const iconKey = name.replace('fa-solid fa-', '').trim();
  return iconMap[iconKey];
};

interface IconProps {
  name: string;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, className = '' }) => {
  const icon = getIcon(name);

  if (!icon) {
    // Fallback for any icons not in our map, or during development
    console.warn(`FontAwesome icon not found in map: "${name}". Falling back to <i> tag.`);
    return <i className={`${name} ${className}`}></i>;
  }

  return <FontAwesomeIcon icon={icon} className={className} />;
};
