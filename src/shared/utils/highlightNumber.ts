export function highlightNumber(phoneNumber: string, searchTerm: string): { parts: { text: string; isHighlighted: boolean }[]; hasMatch: boolean } {
  if (!searchTerm) {
    return { parts: [{ text: phoneNumber, isHighlighted: false }], hasMatch: false };
  }

  const cleanSearchTerm = searchTerm.replace(/[^0-9]/g, '');
  const cleanPhoneNumber = phoneNumber.replace(/[^0-9]/g, '');
  const phoneWithoutPrefix = cleanPhoneNumber.slice(3);

  // Tam eşleşme kontrolü (prefixli ve prefixsiz)
  if (cleanSearchTerm.length >= 7) {
    const exactMatch = cleanPhoneNumber === cleanSearchTerm || phoneWithoutPrefix === cleanSearchTerm;
    if (!exactMatch) {
      return { parts: [{ text: phoneNumber, isHighlighted: false }], hasMatch: false };
    }
  }

  // Find the match position in the cleaned number, then map to display indexes
  let indexInClean = cleanPhoneNumber.indexOf(cleanSearchTerm);
  if (indexInClean === -1) {
    // Try prefix-less match (after first 3 digits)
    const idx = phoneWithoutPrefix.indexOf(cleanSearchTerm);
    if (idx !== -1) {
      indexInClean = 3 + idx;
    }
  }

  if (indexInClean === -1) {
    return { parts: [{ text: phoneNumber, isHighlighted: false }], hasMatch: false };
  }

  // Map the cleaned index to the display string index (accounting for dashes/spaces)
  let numericCount = 0;
  let displayStart = -1;
  let displayEnd = -1;
  for (let i = 0; i < phoneNumber.length; i++) {
    const ch = phoneNumber[i];
    if (/[0-9]/.test(ch)) {
      if (numericCount === indexInClean) displayStart = i;
      if (numericCount === indexInClean + cleanSearchTerm.length) {
        displayEnd = i;
        break;
      }
      numericCount++;
    }
  }

  if (displayStart === -1) {
    return { parts: [{ text: phoneNumber, isHighlighted: false }], hasMatch: false };
  }
  if (displayEnd === -1) displayEnd = phoneNumber.length;

  const parts: { text: string; isHighlighted: boolean }[] = [];
  if (displayStart > 0) parts.push({ text: phoneNumber.slice(0, displayStart), isHighlighted: false });
  parts.push({ text: phoneNumber.slice(displayStart, displayEnd), isHighlighted: true });
  if (displayEnd < phoneNumber.length) parts.push({ text: phoneNumber.slice(displayEnd), isHighlighted: false });

  return { parts, hasMatch: true };
}