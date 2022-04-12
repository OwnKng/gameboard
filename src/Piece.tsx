import { Vector3 } from "three"

type boardProps = {
  position: Vector3
  height: number
}

const Piece = ({ position, height }: boardProps) => {
  return (
    <mesh position={[position.x, position.y, height * 0.15 - 0.05]}>
      <boxBufferGeometry args={[0.9, 0.9, 0.1]} />
      <meshPhongMaterial color='white' />
    </mesh>
  )
}

export default Piece
