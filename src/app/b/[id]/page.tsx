
"use client";

import { useEffect, useState } from "react";
import { BeaconMap } from "@/components/beacon-map";
import { Loader2, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type FriendPosition = { lat: number; lng: number };

export default function FriendViewPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [friendPosition, setFriendPosition] = useState<FriendPosition | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && id) {
        const decodedString = atob(id);
        const position = JSON.parse(decodedString);
        if (position && typeof position.lat === 'number' && typeof position.lng === 'number') {
          setFriendPosition(position);
        } else {
          setError("Invalid location format in the link.");
        }
      }
    } catch (e) {
      console.error("Failed to decode position:", e);
      setError("The location link appears to be corrupted.");
    }
  }, [id]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      <BeaconMap friendPosition={friendPosition} isFriendView={true} position={null} />
      
      <header className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-background/80 via-background/40 to-transparent p-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="text-2xl font-headline font-bold text-primary-foreground drop-shadow-lg" style={{color: 'hsl(var(--primary))'}}>BeaconBuddy</h1>
        </div>
      </header>

      <div className="absolute bottom-0 left-0 right-0 z-10 w-full p-4">
        <Card className="mx-auto max-w-md shadow-2xl">
          <CardContent className="p-6 text-center">
            {error ? (
              <div className="flex flex-col items-center gap-2 text-destructive">
                <AlertTriangle className="h-6 w-6" />
                <p className="font-semibold">Link Error</p>
                <p className="text-sm">{error}</p>
              </div>
            ) : !friendPosition ? (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <p>Finding your friend...</p>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-foreground">Your friend needs help!</h3>
                <p className="mt-1 text-muted-foreground">Their location is marked on the map. Head there to help them out.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
