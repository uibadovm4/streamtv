# StreamTV

A clean, responsive IPTV browser built with plain HTML, CSS and JavaScript.

## Features

- Dark / light theme
- Search
- Dynamic channel categories
- Public IPTV playlist loading
- HLS playback with native HLS + HLS.js fallback
- Responsive mobile layout
- CSS 3D TV scene
- Modular JavaScript files
- No build step required

## Run

Because browsers can restrict local `file://` requests, run the folder through a small local server.

Examples:

```bash
npx serve .
```

or use VS Code Live Server.

Then open the shown local URL.

## Structure

```text
streamtv/
├── index.html
├── css/
│   └── style.css
└── js/
    ├── app.js
    ├── categories.js
    ├── player.js
    ├── playlist.js
    └── ui.js
```

## Data source

The app reads the public IPTV playlist from:

`https://iptv-org.github.io/iptv/index.m3u`

Stream availability can change because the project depends on third-party public streams. Some channels may be offline or block browser playback.

## GitHub Pages

This project is static, so it can be published with GitHub Pages. No backend is required.

For a class project, consider adding your own project description, screenshots and attribution.
