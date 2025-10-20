// Generate consistent colors for tags based on hash
export function getTagColor(tag: string): { bg: string; text: string } {
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    const char = tag.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  // Use hash to generate HSL color
  // Hue: 0-360 degrees for variety
  const hue = Math.abs(hash) % 360;

  // Saturation: 40-70% for pleasant, not oversaturated colors
  const saturation = 40 + (Math.abs(hash >> 8) % 30);

  // Lightness varies by theme
  const lightnessLight = 35 + (Math.abs(hash >> 16) % 10);
  const lightnessDark = 60 + (Math.abs(hash >> 16) % 10);

  return {
    bg: `hsl(${hue}, ${saturation}%, var(--tag-lightness, ${lightnessLight}%))`,
    text: `hsl(${hue}, ${saturation}%, var(--tag-text-lightness, 95%))`,
  };
}
