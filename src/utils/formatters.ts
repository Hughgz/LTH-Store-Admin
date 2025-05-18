/**
 * Formats a number as Vietnamese currency (VND)
 * @param value The number value to format
 * @param options Additional formatting options
 * @returns Formatted price string
 */
export const formatPrice = (
  value: number, 
  options: { 
    compact?: boolean,
    maximumFractionDigits?: number
  } = {}
): string => {
  const { compact = false, maximumFractionDigits = 0 } = options;
  
  const formatter = new Intl.NumberFormat("vi-VN", { 
    style: "currency", 
    currency: "VND",
    ...(compact && { 
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: maximumFractionDigits 
    })
  });
  
  return formatter.format(value);
}; 