import React from 'react';
import Image from 'next/image';

interface OperatorIconProps {
  operator: 'azercell' | 'bakcell' | 'nar-mobile' | 'naxtel';
  size?: number;
  className?: string;
}

const OperatorIcon: React.FC<OperatorIconProps> = ({ 
  operator, 
  size = 16, 
  className = '' 
}) => {
  const iconMap = {
    'azercell': '/images/operators/azercell.svg',
    'bakcell': '/images/operators/bakcell.svg',
    'nar-mobile': '/images/operators/nar-mobile.svg',
    'naxtel': '/images/operators/naxtel.svg'
  };

  const altMap = {
    'azercell': 'Azercell',
    'bakcell': 'Bakcell',
    'nar-mobile': 'Nar Mobile',
    'naxtel': 'Naxtel'
  };

  return (
    <Image
      src={iconMap[operator]}
      alt={altMap[operator]}
      width={size}
      height={size}
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'contain'
      }}
    />
  );
};

export default OperatorIcon;