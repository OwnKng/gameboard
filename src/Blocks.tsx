// @ts-nocheck
import { Instance, Instances } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useLayoutEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"

const color = new THREE.Color()

const Blocks = () => {
  const width = 10
  const height = 10
  const numberPieces = width * height

  const positions = useMemo(() => {
    const positions = []

    for (let i = 0; i < numberPieces; i++) {
      const x = i % width
      const y = Math.floor(i / width)
      positions.push({ x, y, z: 0 })
    }

    return positions
  }, [width, numberPieces])
  return (
    <Instances
      scale={[1, 1, 0.05]}
      position={[0, 3, 0]}
      rotation={[Math.PI * 0.5, 0, 0]}
      limit={numberPieces}
    >
      <boxGeometry args={[0.9, 0.9, 1.0]} />
      <meshPhongMaterial />
      {positions.map((block, i) => (
        <Block key={`block-${i}`} {...block} />
      ))}
    </Instances>
  )
}

const Block = (props: any) => {
  const ref = useRef()

  const [clicks, setClicks] = useState<number>(0)
  const [hovered, setHover] = useState()

  useFrame(() => {
    const { x, y } = props

    ref.current.color.lerp(
      color.set(hovered ? "red" : "white"),
      hovered ? 1 : 0.1
    )

    ref.current.scale.lerp(
      new THREE.Vector3(1, 1, clicks < 1 ? 1 : clicks),
      0.1
    )

    ref.current.position.set(x, y, -clicks / 2)
  })

  return (
    <Instance
      ref={ref}
      onclick={() => setClicks((preVal) => preVal + 1)}
      onPointerOver={(e) => (e.stopPropagation(), setHover(true))}
      onPointerOut={(e) => setHover(false)}
      onClick={(e) => (e.stopPropagation(), setClicks((curr) => curr + 10))}
    />
  )
}

export default Blocks
