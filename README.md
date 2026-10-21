# Kawaiiculator

A cute, local desktop calculator for Windows, built with Electron, React, Tailwind CSS, and shadcn/ui.

<p align="center">
  <img src="https://raw.githubusercontent.com/droidddd21/kawaiiculator/main/public/previews/macos-sakura.png" width="549" alt="Kawaiiculator macOS preview">
</p>

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

## Build a Windows installer

```powershell
pnpm package
```

The generated installer is saved in `release/`.
