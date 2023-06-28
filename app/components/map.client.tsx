import { useCallback, useEffect, useMemo, useState } from "react"
import type { LatLngTuple, Map, Marker } from "leaflet"
import {
  MapContainer,
  TileLayer,
  Marker as MarkerComponent,
} from "react-leaflet"
import { DEFAULT_MAP_ZOOM } from "~/constants"

function DisplayPosition({ map, marker }: { map: Map; marker: Marker | null }) {
  const [position, setPosition] = useState(() => map.getCenter())

  const onClick = useCallback(() => {
    map.setView(map.getCenter(), DEFAULT_MAP_ZOOM)
  }, [map])

  const onMove = useCallback(() => {
    if (marker) {
      marker.setLatLng(map.getCenter())
    }
    setPosition(map.getCenter())
  }, [map])

  useEffect(() => {
    map.on("move", onMove)
    return () => {
      map.off("move", onMove)
    }
  }, [map, onMove])

  return (
    <>
      <HiddenInput
        position={{
          lat: Number(position.lat.toFixed(4)),
          lng: Number(position.lng.toFixed(4)),
        }}
      ></HiddenInput>
    </>
  )
}

export function MapComponent({
  height = "400px",
  initPosition,
  map,
  setMap,
}: {
  map: Map | null
  setMap: React.Ref<Map> | undefined
  height?: string
  initPosition: LatLngTuple
}) {
  const [marker, setMarker] = useState<Marker | null>(null)

  const displayMap = useMemo(
    () => (
      <MapContainer
        center={initPosition}
        zoom={13}
        scrollWheelZoom={false}
        doubleClickZoom="center"
        easeLinearity={1}
        maxZoom={17}
        minZoom={2}
        ref={setMap}
        style={{ height }}
        id="__map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerComponent
          position={initPosition}
          ref={setMarker}
        ></MarkerComponent>
      </MapContainer>
    ),
    [],
  )

  return (
    <div>
      {map ? <DisplayPosition map={map} marker={marker} /> : null}
      {displayMap}
    </div>
  )
}

export function HiddenInput({
  position,
}: {
  position: { lng: number; lat: number }
}) {
  return (
    <div style={{width : 0}}>
      <input type="hidden" name="xAxis" value={position.lat} />
      <input type="hidden" name="yAxis" value={position.lng} />
    </div>
  )
}
