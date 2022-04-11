import { Vector3 } from "three"
import * as THREE from "three"

type planeProps = {
  handleClick: (point: Vector3) => void
}

const Plane = ({ handleClick }: planeProps) => {
  return (
    <mesh
      onClick={(e) => {
        const { x, z } = e.point
        const point = new THREE.Vector3(x, 0, z)
        handleClick(point.floor())
      }}
      rotation={[-Math.PI * 0.5, 0, 0]}
    >
      <planeBufferGeometry args={[10, 10, 1, 1]} />
      <meshBasicMaterial color='teal' />
    </mesh>
  )
}

export default Plane
