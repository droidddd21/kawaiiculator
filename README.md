# Kawaiiculator

A cute, local desktop calculator for Windows, built with Electron, React, Tailwind CSS, and shadcn/ui.

![Kawaiiculator in the Sakura theme](https://raw.githubusercontent.com/droidddd21/kawaiiculator/main/public/previews/macos-sakura.svg)

![Kawaiiculator palette picker](https://raw.githubusercontent.com/droidddd21/kawaiiculator/main/public/previews/macos-palettes.svg)

## Features

- Core calculator operations, percentages, sign swap, and keyboard controls.
- Three switchable palettes: Sakura, Lilac, and Mint.
- A saved calculation history of up to 30 entries.
- Desktop window controls, including drag, minimize, maximize, and close.

## Run locally

```powershell
pnpm install
pnpm desktop
```

## Build a portable Windows executable

```powershell
pnpm package
```

The generated `.exe` is saved in `release/`.
