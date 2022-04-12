import "./App.css"
import { Canvas } from "@react-three/fiber"
import Blocks from "./Blocks"
import { useState } from "react"
import { Vector3 } from "three"

const App = () => {
  const [state, setState] = useState<Vector3[]>([])

  return (
    <div className='App'>
      <Canvas
        orthographic
        camera={{ zoom: 100 }}
        onCreated={({ camera }) => {
          camera.position.setFromSphericalCoords(20, Math.PI / 3, Math.PI / 4)
          camera.lookAt(0, 0, 0)
        }}
        shadows
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 20, 0]} intensity={0.6} />
        <Blocks />
      </Canvas>
    </div>
  )
}

export default App
