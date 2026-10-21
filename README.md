# Кальку-чан ✦

Небольшой уютный калькулятор для Windows на Electron, React, Tailwind и shadcn/ui.

## Запуск

В среде с установленными Node.js и pnpm:

```powershell
pnpm install
pnpm desktop
```

`pnpm desktop` поднимает Vite и открывает отдельное desktop-окно Electron.

## Сборка portable `.exe`

```powershell
pnpm package
```

Артефакт появится в папке `release/`.

## Возможности

- базовые операции, проценты, смена знака и очистка;
- управление с клавиатуры (`Enter`, `Esc`, `Backspace`, цифры и операторы);
- тёплая кремово-персиковая тема с мягкими тенями;
- шадcn/ui: `Card`, `Button`, `Badge`.

