import { useEffect, useState } from "react"
import { Delete, History, Minus, Palette, Square, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type Operator = "+" | "−" | "×" | "÷" | null
type Theme = "sakura" | "lilac" | "mint"
type HistoryItem = { expression: string; result: string }
type AppWindow = Window & typeof globalThis & { kawaiiculator?: { minimize: () => void; maximize: () => void; close: () => void } }
const keys = [["AC", "±", "%", "÷"], ["7", "8", "9", "×"], ["4", "5", "6", "−"], ["1", "2", "3", "+"], ["0", ".", "⌫", "="]]
const isOperator = (key: string): key is Exclude<Operator, null> => ["+", "−", "×", "÷"].includes(key)
const calculate = (a: number, b: number, op: Exclude<Operator, null>) => op === "+" ? a + b : op === "−" ? a - b : op === "×" ? a * b : b === 0 ? NaN : a / b

function App() {
  const [display, setDisplay] = useState("0")
  const [memory, setMemory] = useState<number | null>(null)
  const [pending, setPending] = useState<Operator>(null)
  const [fresh, setFresh] = useState(true)
  const [hint, setHint] = useState("Ready")
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem("kawaiiculator-theme") as Theme) || "sakura")
  const [history, setHistory] = useState<HistoryItem[]>(() => { try { return JSON.parse(localStorage.getItem("kawaiiculator-history") || "[]") } catch { return [] } })
  const appWindow = window as AppWindow
  const saveHistory = (items: HistoryItem[]) => { setHistory(items); localStorage.setItem("kawaiiculator-history", JSON.stringify(items)) }
  const press = (key: string) => {
    if (/^\d$/.test(key)) { setDisplay((v) => fresh ? key : v === "0" ? key : v + key); setFresh(false); return }
    if (key === ".") { setDisplay((v) => fresh ? "0." : v.includes(".") ? v : v + "."); setFresh(false); return }
    if (key === "AC") { setDisplay("0"); setMemory(null); setPending(null); setFresh(true); setHint("Ready"); return }
    if (key === "⌫") { setDisplay((v) => fresh || v.length < 2 ? "0" : v.slice(0, -1)); return }
    if (key === "±") { setDisplay((v) => v === "0" ? v : String(-Number(v))); return }
    if (key === "%") { setDisplay((v) => String(Number(v) / 100)); setFresh(true); return }
    if (isOperator(key)) { const result = pending && memory !== null && !fresh ? calculate(memory, Number(display), pending) : Number(display); setDisplay(Number.isFinite(result) ? String(result) : "Error"); setMemory(result); setPending(key); setHint(`${display} ${key}`); setFresh(true); return }
    if (key === "=" && pending && memory !== null) { const result = calculate(memory, Number(display), pending); const expression = `${memory} ${pending} ${display}`; const value = Number.isFinite(result) ? String(Number(result.toFixed(10))) : "Error"; setHint(`${expression} =`); setDisplay(value); saveHistory([{ expression, result: value }, ...history].slice(0, 30)); setMemory(null); setPending(null); setFresh(true) }
  }
  useEffect(() => { localStorage.setItem("kawaiiculator-theme", theme) }, [theme])
  useEffect(() => { const listener = (e: KeyboardEvent) => { const map: Record<string, string> = { "/": "÷", "*": "×", "-": "−", Enter: "=", Backspace: "⌫", Escape: "AC" }; const key = map[e.key] ?? e.key; if (/^\d$/.test(key) || [".", "+", "−", "×", "÷", "=", "⌫", "AC"].includes(key)) { e.preventDefault(); press(key) } }; window.addEventListener("keydown", listener); return () => window.removeEventListener("keydown", listener) })
  return <main className="min-h-screen" data-theme={theme}>
    <div className="window-bar"><span>Calculator</span><div className="window-controls"><Button variant="ghost" size="icon-sm" onClick={() => appWindow.kawaiiculator?.minimize()} aria-label="Minimize"><Minus /></Button><Button variant="ghost" size="icon-sm" onClick={() => appWindow.kawaiiculator?.maximize()} aria-label="Maximize"><Square /></Button><Button variant="ghost" size="icon-sm" onClick={() => appWindow.kawaiiculator?.close()} aria-label="Close"><X /></Button></div></div>
    <Card className="calculator mx-auto w-full max-w-md rounded-none border-0 bg-card shadow-none"><CardHeader className="header"><div><CardTitle className="brand-title">Calculator</CardTitle><CardDescription>Desktop calculator</CardDescription></div><div className="flex gap-1"><Dialog><DialogTrigger asChild><Button variant="ghost" size="icon-sm" aria-label="Choose theme"><Palette /></Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Pick a palette</DialogTitle><DialogDescription>Choose a color palette for the calculator.</DialogDescription></DialogHeader><ToggleGroup type="single" value={theme} onValueChange={(value) => value && setTheme(value as Theme)} variant="outline" spacing={2} className="theme-picker"><ToggleGroupItem value="sakura">Sakura</ToggleGroupItem><ToggleGroupItem value="lilac">Lilac</ToggleGroupItem><ToggleGroupItem value="mint">Mint</ToggleGroupItem></ToggleGroup></DialogContent></Dialog><Dialog><DialogTrigger asChild><Button variant="ghost" size="icon-sm" aria-label="Open history"><History /></Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Calculation history</DialogTitle><DialogDescription>Last {history.length} of 30 calculations.</DialogDescription></DialogHeader><ScrollArea className="history-scroll">{history.length ? <div className="flex flex-col gap-2">{history.map((item, index) => <Button key={`${item.expression}-${index}`} variant="outline" className="history-row" onClick={() => { setDisplay(item.result); setFresh(true) }}><span>{item.expression}</span><strong>= {item.result}</strong></Button>)}</div> : <p className="history-empty">Nothing here yet.</p>}</ScrollArea><Button variant="outline" disabled={!history.length} onClick={() => saveHistory([])}>Clear history</Button></DialogContent></Dialog></div></CardHeader>
    <CardContent className="content"><section aria-live="polite" className="display"><p>{hint}</p><output>{display}</output></section><div className="grid grid-cols-4 gap-2.5" aria-label="Calculator keys">{keys.flat().map((key) => { const utility = ["AC", "±", "%", "⌫"].includes(key); return <Button key={key} type="button" onClick={() => press(key)} variant={key === "=" ? "default" : isOperator(key) ? "secondary" : utility ? "outline" : "ghost"} className="calc-key" aria-label={key === "⌫" ? "Delete" : key}>{key === "⌫" ? <Delete aria-hidden="true" /> : key}</Button> })}</div></CardContent><footer>keyboard input supported</footer></Card>
  </main>
}
export default App

