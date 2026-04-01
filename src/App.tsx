import { useState, useEffect } from 'react'
import './App.css'

import { Button } from './components/ui/button'

const API_URL = "http://192.168.0.9:8000"
const WS_URL = "ws://192.168.0.9:8000/ws"

function App() {
   const [ledState, setLedState] = useState<"on" | "off">("off")

    useEffect(() => {
      const ws = new WebSocket(WS_URL)
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        setLedState(data.state)
      }
      return () => ws.close()
    }, [])

  const toggleLed = async () => {
    const newState = ledState === "on" ? "off" : "on"
    await fetch(`${API_URL}/led/${newState}`, { method: "POST" })
  }

  return (
        <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold">HelmOS LED Control</h1>
        <div className={`w-8 h-8 rounded-full ${ledState === "on" ? "bg-green-500" : "bg-gray-400"}`} />
        <Button
          onClick={toggleLed}
          variant={ledState === "on" ? "default" : "outline"}
        >
          {ledState === "on" ? "Turn Off" : "Turn On"}
        </Button>
      </div>
    </div>
  )
}

export default App
