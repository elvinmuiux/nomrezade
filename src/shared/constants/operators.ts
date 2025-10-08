/**
 * Operator ve prefix mapping konstantları
 * Tüm operator-prefix ilişkileri burada merkezi olarak yönetilir
 */

export const OPERATORS = {
  AZERCELL: 'Azercell',
  BAKCELL: 'Bakcell', 
  NAXTEL: 'Naxtel',
  NAR_MOBILE: 'Nar Mobile'
} as const;

export const PREFIXES = {
  '010': OPERATORS.AZERCELL,
  '050': OPERATORS.AZERCELL,
  '051': OPERATORS.AZERCELL,
  '055': OPERATORS.BAKCELL,
  '099': OPERATORS.BAKCELL,
  '060': OPERATORS.NAXTEL,
  '070': OPERATORS.NAR_MOBILE,
  '077': OPERATORS.NAR_MOBILE
} as const;

export const OPERATOR_PREFIXES = {
  [OPERATORS.AZERCELL]: ['010', '050', '051'],
  [OPERATORS.BAKCELL]: ['055', '099'],
  [OPERATORS.NAXTEL]: ['060'],
  [OPERATORS.NAR_MOBILE]: ['070', '077']
} as const;

// All phone prefixes in array format
export const PHONE_PREFIXES = ['010', '050', '051', '055', '060', '070', '077', '099'] as const;

export const ARRAY_KEYS = {
  [OPERATORS.AZERCELL]: 'azercellAds',
  [OPERATORS.BAKCELL]: 'bakcellAds', 
  [OPERATORS.NAXTEL]: 'naxtelAds',
  [OPERATORS.NAR_MOBILE]: 'narmobileAds'
} as const;

export const AD_TYPES = {
  STANDARD: 'standard',
  GOLD: 'gold', 
  PREMIUM: 'premium'
} as const;

export const AD_DURATIONS = {
  [AD_TYPES.STANDARD]: 7,  // 7 gün
  [AD_TYPES.GOLD]: 20,     // 20 gün
  [AD_TYPES.PREMIUM]: 30   // 30 gün
} as const;

export const PREFIX_LIST = ['010', '050', '051', '055', '060', '070', '077', '099'] as const;
export const TYPE_LIST = ['standard', 'gold', 'premium'] as const;

// Helper fonksiyonlar
export const getOperatorFromPrefix = (prefix: string): string => {
  return PREFIXES[prefix as keyof typeof PREFIXES] || 'Unknown';
};

export const getArrayKeyFromOperator = (operator: string): string => {
  return ARRAY_KEYS[operator as keyof typeof ARRAY_KEYS] || 'unknownAds';
};

export const getPrefixesForOperator = (operator: string): readonly string[] => {
  return OPERATOR_PREFIXES[operator as keyof typeof OPERATOR_PREFIXES] || [];
};
