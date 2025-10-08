export interface SearchAndFilterProps {
  showTypeFilter?: boolean;
  showPrefixFilter?: boolean;
  searchPlaceholder?: string;
  className?: string;
}

export interface DropdownState {
  isTypeDropdownOpen: boolean;
  isPrefixDropdownOpen: boolean;
  isMobileTypeDropdownOpen: boolean;
  isMobilePrefixDropdownOpen: boolean;
}

export interface DropdownRefs {
  typeDropdownRef: React.RefObject<HTMLDivElement | null>;
  prefixDropdownRef: React.RefObject<HTMLDivElement | null>;
  mobileTypeDropdownRef: React.RefObject<HTMLDivElement | null>;
  mobilePrefixDropdownRef: React.RefObject<HTMLDivElement | null>;
}
