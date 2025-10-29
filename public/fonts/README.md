# Tiger Shark Font Setup

## Download Instructions

To use the Tiger Shark font in your project:

1. **Download the font:**
   - Visit: https://www.1001freefonts.com/tiger-shark.font
   - Download the font file (usually comes as `.zip`)
   - Extract the archive to get the font files

2. **Place font files here:**
   - Copy one or more of these formats to this `public/fonts/` directory:
     - `tigershark.woff2` (recommended - best compression)
     - `tigershark.woff` (alternative)
     - `tigershark.ttf` (fallback)

3. **Font files should be named exactly:**
   - `tigershark.woff2`
   - `tigershark.woff`  
   - `tigershark.ttf`

## Note on Licensing

- Tiger Shark font is **free for personal use**
- For commercial use, a donation is required (check with Iconian Fonts)
- Ensure you comply with the licensing terms

## Verification

After placing the font files:
1. Restart your Next.js development server
2. The h1 heading in the hero section should display with Tiger Shark font
3. Check browser DevTools → Network to verify font files are loading

## Font is Already Configured

The font has already been set up in:
- ✅ `app/globals.css` - @font-face declaration
- ✅ `tailwind.config.ts` - Custom font family utility (`font-tiger-shark`)
- ✅ `components/ui/tubes-cursor.tsx` - Applied to h1 heading

Once you add the font files here, everything will work automatically!

