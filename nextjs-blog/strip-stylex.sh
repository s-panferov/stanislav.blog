#!/bin/bash
# Quick script to remove stylex from all files

for file in app/**/*.tsx components/*.tsx; do
  if [ -f "$file" ]; then
    # Remove stylex imports
    sed -i '' '/import.*stylex/d' "$file"
    # Remove stylex.create blocks
    sed -i '' '/const styles = stylex.create/,/^});$/d' "$file"
    # Remove {...stylex.props(...)} patterns - replace with empty or className
    sed -i '' 's/{...stylex\.props([^)]*)}//g' "$file"
    echo "Processed $file"
  fi
done
