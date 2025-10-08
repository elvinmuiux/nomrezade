import { LucideIcon } from 'lucide-react';
import { IconType } from 'react-icons';

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: LucideIcon | IconType;
  operatorIcon?: 'azercell' | 'bakcell' | 'nar-mobile' | 'naxtel';
  hasDropdown?: boolean;
  children?: NavigationItem[];
}

export interface SidebarProps {
  className?: string;
}

export interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  src?: string;
  alt?: string;
  title?: string;
  subtitle?: string;
  showBrandInfo?: boolean;
}
