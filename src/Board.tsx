import { Vector3 } from "three"

type boardProps = {
  positions: Vector3[]
}

const Board = ({ positions }: boardProps) => {
  return (
    <group>
      {positions.map((position, i) => (
        <mesh key={`${i}-position`} position={position}>
          <boxBufferGeometry />
          <meshBasicMaterial />
        </mesh>
      ))}
    </group>
  )
}

export default Board
