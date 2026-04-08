import "./index.css";
import "./hud.css";
import "./App.css";
import MapView from "./map/MapView";
import { BottomBar } from "./components/BottomBar";

export default function App() {
  return (
    <>
      <MapView />
      <BottomBar
        version="0.1.0"
      />
    </>
  );
}