//@ts-nocheck
import { useRef } from "react"
import * as THREE from "three"
import { InstancedMesh } from "three"
import { useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { lerp } from "three/src/math/MathUtils"

const width = 10
const height = 10
const numberPieces = width * height

const tempObject = new THREE.Object3D()
const tempColor = new THREE.Color()

const colors = Array.from({ length: numberPieces }, () =>
  new THREE.Color("#8EDCE6").toArray()
).flat()

const colorsArray = new Float32Array(colors)

let clicks = Array.from({ length: numberPieces }, (d, i) => ({
  id: i,
  numberOfClicks: 0,
}))

const addClick = (clicks) => (clicks < 50 ? clicks + 10 : 0)

const Board = () => {
  const [hovered, set] = useState<number | undefined>()
  const meshRef = useRef<InstancedMesh>(null!)
  const prevRef = useRef<void | number>(null!)

  const clicksRef = useRef(clicks)

  const handleClick = (id: number) => {
    const clicked = clicksRef.current
      .filter((d) => d.id === id)
      .map((d) => ({ ...d, numberOfClicks: addClick(d.numberOfClicks) }))

    const others = clicksRef.current.filter((d) => d.id !== id)

    clicksRef.current = others.concat(clicked)
  }

  const getHeight = (id: number) =>
    clicksRef.current.filter((d) => d.id === id)[0].numberOfClicks

  useEffect(() => void (prevRef.current = hovered), [hovered])

  useFrame(() => {
    for (let i = 0; i < numberPieces; i++) {
      const x = i % width
      const y = Math.floor(i / width)

      if (hovered !== prevRef.Current) {
        tempColor
          .set(i === hovered ? "white" : "#8EDCE6")
          .toArray(colorsArray, i * 3)

        meshRef.current.geometry.attributes.color.needsUpdate = true
      }

      tempObject.position.set(x, y, 0)
      tempObject.scale.set(1, 1, getHeight(i) < 1 ? 1 : getHeight(i))

      tempObject.applyMatrix4(
        new THREE.Matrix4().makeTranslation(0, 0, -getHeight(i) / 2)
      )

      tempObject.updateMatrix()

      meshRef.current.setMatrixAt(i, tempObject.matrix)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh
      scale={[1, 1, 0.05]}
      rotation={[Math.PI * 0.5, 0, 0]}
      position={[0, 3, 0]}
      ref={meshRef}
      args={[undefined, undefined, numberPieces]}
      onPointerMove={(e) => set(e.instanceId)}
      onPointerOut={(e) => set(undefined)}
      onClick={(e) => handleClick(e.instanceId)}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[0.9, 0.9, 1.0]}>
        <instancedBufferAttribute
          attachObject={["attributes", "color"]}
          args={[colorsArray, 3]}
        />
      </boxGeometry>
      <meshPhongMaterial vertexColors={THREE.VertexColors} />
    </instancedMesh>
  )
}

export default Board
