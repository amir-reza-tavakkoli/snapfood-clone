// import { LatLngTuple, Marker, Popup } from "leaflet"
import { LatLngTuple } from "leaflet"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"

// import { useCallback, useEffect, useMemo, useState } from "react"
// import { MapContainer, TileLayer } from "react-leaflet"

// const center = {
//   lat: 51.505,
//   lng: -0.09,
// }

// function DraggableMarker() {
//   const [draggable, setDraggable] = useState(false)
//   const [position, setPosition] = useState(center)
//   const markerRef = useRef(null)
//   const eventHandlers = useMemo(
//     () => ({
//       dragend() {
//         const marker:any = markerRef.current
//         if (marker != null) {
//           setPosition(marker.getLatLng())
//         }
//       },
//     }),
//     [],
//   )
//   const toggleDraggable = useCallback(() => {
//     setDraggable(d => !d)
//   }, [])

//   return (
//     <Marker
//       draggable={draggable}
//       eventHandlers={eventHandlers}
//       position={position}
//       ref={markerRef}
//     >
//       <Popup minWidth={90}>
//         <span onClick={toggleDraggable}>
//           {draggable
//             ? "Marker is draggable"
//             : "Click here to make marker draggable"}
//         </span>
//       </Popup>
//     </Marker>
//   )
// }

// export function Map({ height, position }: { height: string; position: LatLngTuple }) {
//      const x: LatLngTuple = [51.505, -0.09]
// let [map, setMap] = useState(null);
//   return (
//     <div style={{ height }}>
//       <MapContainer
//         style={{
//           height: "100%",
//         }}
//         center={position}
//         zoom={13}
//         scrollWheelZoom={false} doubleClickZoom={"center"}
//         ref={setMap}
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         <Marker position={position}>
//           <Popup>
//             A pretty CSS3 popup. <br /> Easily customizable.
//           </Popup>
//         </Marker>
//         <DraggableMarker />
//       </MapContainer>
//     </div>
//   )
// }
const center = [51.505, -0.09]
const zoom = 13
function DisplayPosition({ map }: any) {
  const [position, setPosition] = useState(() => map.getCenter())

  const onClick = useCallback(() => {
    map.setView(center, zoom)
  }, [map])

  const onMove = useCallback(() => {
    setPosition(map.getCenter())
  }, [map])

  useEffect(() => {
    map.on("move", onMove)
    return () => {
      map.off("move", onMove)
    }
  }, [map, onMove])

  return (
    <p>
      latitude: {position.lat.toFixed(4)}, longitude: {position.lng.toFixed(4)}{" "}
      <button onClick={onClick}>reset</button>
    </p>
  )
}

export function Map({
  height,
  position,
}: {
  height: string
  position: LatLngTuple
}) {
  const [map, setMap] = useState(null)

  const displayMap = useMemo(
    () => (
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        ref={setMap}
        style={{ height }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        // <Marker position={position}></Marker>
      </MapContainer>
    ),
    [],
  )

  return (
    <div>
      {map ? <DisplayPosition map={map} /> : null}
      {displayMap}
    </div>
  )
}
