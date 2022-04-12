// @ts-nocheck
import { Instance, Instances } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { Vector3 } from "three"
import Piece from "./Piece"

const tempColor = new THREE.Color()

type pieceType = {
  position: Vector3
  height: number
}

const Blocks = () => {
  const width = 8
  const height = 8
  const numberPieces = width * height

  const [pieces, setPieces] = useState<pieceType[] | null>(null)

  const positions = useMemo(() => {
    const positions = []

    for (let i = 0; i < numberPieces; i++) {
      const x = i % width
      const y = Math.floor(i / width)
      positions.push(new THREE.Vector3(x, y, 0))
    }

    return positions
  }, [width, numberPieces])

  const newPoint = (point) => ({ position: point, height: 1 })

  const incrementHeight = (point) => ({ ...point, height: point.height + 1 })

  const handleClick = (point: Vector3) => {
    if (!pieces) return setPieces([newPoint(point)])

    const hasPoint = (piece) => point.distanceTo(piece.position) > 0

    if (pieces.every(hasPoint)) return setPieces([...pieces, newPoint(point)])

    const newPieces = pieces
      .filter(hasPoint)
      .concat(pieces.filter((point) => !hasPoint(point)).map(incrementHeight))

    setPieces(newPieces)
  }

  return (
    <group
      position={[-width / 2, 0, width / 2]}
      rotation={[-Math.PI * 0.5, 0, 0]}
    >
      <Instances limit={numberPieces}>
        <boxGeometry args={[0.9, 0.9, 0.05]} />
        <meshPhongMaterial />
        {positions.map((block, i) => (
          <Block
            key={`block-${i}`}
            coordinates={block}
            color={i % 2 ? "white" : "black"}
            handleClick={(point) => handleClick(point)}
          />
        ))}
      </Instances>
      {pieces?.map(({ position, height }) =>
        Array.from({ length: height }, (_, i) => (
          <Piece key={`${position}-${i}`} position={position} height={i + 1} />
        ))
      )}
    </group>
  )
}

type blockType = {
  coordinates: Vector3
  handleClick: (point: Vector3) => void
  color: string
}

const Block = ({ coordinates, color, handleClick }: blockType) => {
  const ref = useRef()

  const [hovered, setHover] = useState()

  useFrame(() => {
    ref.current.color.lerp(
      tempColor.set(hovered ? "red" : color),
      hovered ? 1 : 0.1
    )

    ref.current.position.set(coordinates.x, coordinates.y, coordinates.z)
  })

  return (
    <Instance
      ref={ref}
      onclick={() => setClicks((preVal) => preVal + 1)}
      onPointerOver={(e) => (e.stopPropagation(), setHover(true))}
      onPointerOut={(e) => setHover(false)}
      onClick={(e) => (e.stopPropagation(), handleClick(coordinates))}
    />
  )
}

export default Blocks
