"use client";

import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

type BeaconMapProps = {
  position: { lat: number; lng: number } | null;
  friendPosition?: { lat: number; lng: number } | null;
  isFriendView?: boolean;
};

export function BeaconMap({ position, friendPosition, isFriendView = false }: BeaconMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <p className="max-w-xs text-center text-muted-foreground">
          Google Maps API Key is not configured. Please set the
          <code className="mx-1 rounded bg-secondary px-1.5 py-1 text-xs font-code">
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
          </code>
          environment variable.
        </p>
      </div>
    );
  }
  
  const mapCenter = isFriendView ? friendPosition : position;
  const zoomLevel = mapCenter ? 16 : 10;
  const defaultCenter = { lat: 34.0522, lng: -118.2437 }; // Default to Los Angeles

  return (
    <APIProvider apiKey={apiKey}>
      <div className="absolute inset-0 transition-all duration-500 ease-in-out">
        <Map
          center={mapCenter || defaultCenter}
          zoom={zoomLevel}
          mapId="d91515ee1c708fac"
          disableDefaultUI={true}
          gestureHandling={'greedy'}
          className="h-full w-full"
        >
          {position && !isFriendView && (
            <AdvancedMarker position={position}>
              <Pin 
                background={'hsl(var(--primary))'} 
                glyphColor={'hsl(var(--primary-foreground))'} 
                borderColor={'hsl(var(--primary))'} 
              />
            </AdvancedMarker>
          )}
          {friendPosition && isFriendView && (
             <AdvancedMarker position={friendPosition}>
               <Pin 
                background={'hsl(var(--accent))'} 
                glyphColor={'hsl(var(--accent-foreground))'} 
                borderColor={'hsl(var(--accent))'}
              />
             </AdvancedMarker>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}
