import "./index.css";
import "./hud.css";
import "./App.css";
import MapView from "./map/MapView";
import { BottomBar } from "./components/BottomBar";

export default function App() {
  return (
    <div className="app-layout">
      <div className="app-main">
        <MapView />
      </div>

      <BottomBar version="0.1.0" />
    </div>
  );
}