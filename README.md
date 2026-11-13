# Pixora

Pixora is a browser-based image and document utility studio built with React and Vite.

## Included tools
- AI background removal
- AI image captioning
- Manual erase/restore editor
- Passport photo presets
- Image-to-PDF export
- Batch JPEG compression
- 2x canvas enlargement (resampling, not generative super-resolution)
- Resize and convert JPG/PNG/WebP
- Front/back image merger
- Signature drawing pad
- Responsive interface, themes, accent colours and helper mascot

## Run on Windows
1. Install Node.js 20 or newer: https://nodejs.org/
2. Extract this ZIP.
3. In VS Code choose **File > Open Folder** and select the `Pixora-Final` folder.
4. Open **Terminal > New Terminal**. If PowerShell blocks npm, select Command Prompt as the terminal profile.
5. Confirm `dir` shows `package.json` in the current folder.
6. Run `npm install`, then `npm run dev`.
7. Open the local URL shown by Vite, normally http://localhost:5173.

## Build for Netlify
Run `npm run build`. This creates `dist/`. Netlify build settings:
- Build command: `npm run build`
- Publish directory: `dist`

This project includes `netlify.toml` with these settings. You can connect the GitHub repository to Netlify for automatic redeployment, or use https://app.netlify.com/drop to upload the generated `dist` folder.

## Logo
The supplied promotional logo artwork is `public/pixora-brand.png`. The compact browser favicon is `public/pixora-logo.svg`.

## Cost, privacy and limitations
- Static hosting may be available on Netlify's free plan, subject to current quotas and terms. A free Netlify subdomain can be used; custom domains generally cost money.
- Image processing is client-side; this project does not include a Pixora image-upload backend, user accounts or cloud storage.
- AI model assets are downloaded from third-party providers and need internet access. Device performance and model availability vary.
- `@imgly/background-removal` is AGPL-3.0. Review licence obligations before public or commercial use; a separate commercial licence may be required for some uses. Review all model and dependency licences too.
- Passport presets are approximate centre-crops, not a guarantee of official photo compliance.
- Signature export is a drawn PNG, not a cryptographic/legal e-signature.
- 2x enlargement is canvas resampling, not generative AI super-resolution.
- Free hosting is not a promise of unlimited traffic or unlimited AI use.
