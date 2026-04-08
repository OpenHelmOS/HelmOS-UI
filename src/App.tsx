import MapView from "./map/MapView";


function App() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden"
      }}
    >
      <MapView />
    </div>
  )
}

export default App