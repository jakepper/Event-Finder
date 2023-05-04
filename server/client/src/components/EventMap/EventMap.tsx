import axios from "axios";
import { useState, useEffect, useRef } from "react";
import Map, { Marker, FullscreenControl, MapRef } from "react-map-gl";

type MapProps = {
   location: {
      address: string,
      city: string,
      state: string,
      code: string
   }
}

export default function EventMap({ location } : MapProps) {

   const mapRef = useRef<MapRef>(null);

   const [marker, setMarker] = useState(false);
   const [viewport, setViewport] = useState({
      latitude: 0,
      longitude: 0,
      zoom: 0,
   });

   const onMapLoad = async () => {
      const query = encodeURIComponent(`${location.address}, ${location.city}, ${location.state}, ${location.code}`);
      const result = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=pk.eyJ1IjoiamFrZXBwIiwiYSI6ImNsZ2g2ejdpejBhOTMzZG9zdG4zaWNzb2gifQ.ys1M4eLsvGUYrZL__5o-Jw`);
      if (result.status == 200) {
         const center = result.data.features[0].center;
         setViewport({
            latitude: center[1],
            longitude: center[0],
            zoom: 0
         });
         const map = mapRef.current?.getMap();
         map?.setCenter([center[0], center[1]]).setZoom(14);
         setMarker(true);
      }
   }

   return (
      <Map
         ref={mapRef}
         style={{width: '100%', height: '100%'}}
         mapStyle="mapbox://styles/mapbox/dark-v11"
         onLoad={onMapLoad}
         mapboxAccessToken="pk.eyJ1IjoiamFrZXBwIiwiYSI6ImNsZ2g2ejdpejBhOTMzZG9zdG4zaWNzb2gifQ.ys1M4eLsvGUYrZL__5o-Jw"
      >
         {marker && <Marker longitude={viewport.longitude} latitude={viewport.latitude} anchor="bottom"/>}
         <FullscreenControl />
      </Map>
   );
}