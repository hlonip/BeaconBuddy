
"use client";

import { useState, useEffect, useRef } from "react";
import { useGeolocation } from "@/hooks/use-geolocation";
import { describeLocation } from "@/ai/flows/describe-location";
import { textToSpeech } from "@/ai/flows/text-to-speech";
import { BeaconMap } from "@/components/beacon-map";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, Loader2, AlertTriangle, Menu, Pause, Volume2, Phone, MessageSquare, Mail, Utensils, Sun, Moon, Share2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import { ClipboardCopy } from "lucide-react";


const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );

export default function Home() {
  const { position, error: geoError } = useGeolocation();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const [description, setDescription] = useState("");
  const [isDescriptionLoading, setIsDescriptionLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [origin, setOrigin] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const createShareUrl = () => {
    if (!position || !origin) {
      return null;
    }
    try {
        const encodedPosition = btoa(JSON.stringify(position));
        return `${origin}/b/${encodedPosition}`;
    } catch (e) {
        console.error("Failed to encode position for URL", e);
        return null;
    }
  }

  const showLocationNotReadyToast = () => {
    toast({
        variant: "destructive",
        title: "Location not ready",
        description: "Cannot perform this action without your location.",
    });
  }

  const handleDescribeLocation = async () => {
    if (!position) {
      toast({
        variant: "destructive",
        title: "Location not available",
        description: "Please enable location services to use this feature.",
      });
      return;
    }
    setIsDescriptionLoading(true);
    setDescription("");
    setAudioUrl(null);
    if(audioRef.current) {
        audioRef.current.pause();
        setIsAudioPlaying(false);
    }

    try {
      const result = await describeLocation(
        { latitude: position.lat, longitude: position.lng }
      );
      setDescription(result.locationDescription);

      const audioResult = await textToSpeech(result.locationDescription);
      setAudioUrl(audioResult.media);

    } catch (error) {
      console.error("Error describing location:", error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Could not generate location description.",
      });
    } finally {
      setIsDescriptionLoading(false);
    }
  };
  
  const handleCopyUrl = () => {
    const url = createShareUrl();
    if (!url) {
        showLocationNotReadyToast();
        return;
    }
    navigator.clipboard.writeText(url);
    toast({ title: "Copied to clipboard!" });
  };

  const handleShareOnWhatsApp = () => {
    const url = createShareUrl();
    if (!url) {
        showLocationNotReadyToast();
        return;
    }

    const shareData = {
      title: "BeaconBuddy Location",
      text: `I'm lost and need help. Here's my location:`,
      url: url,
    };
    
    if (navigator.share) {
        navigator.share(shareData).catch((error) => {
             if (error instanceof DOMException && error.name === 'AbortError') {
                return;
            }
             toast({
                variant: "destructive",
                title: "Share Error",
                description: "Could not share the link.",
            });
        });
    } else {
        // Fallback for desktop or browsers that don't support web share
        const message = encodeURIComponent(`${shareData.text} ${shareData.url}`);
        window.open(`https://wa.me/?text=${message}`, '_blank');
    }
  };

  const handleShareAudioOnWhatsApp = async () => {
    const url = createShareUrl();
    if (!url) {
      showLocationNotReadyToast();
      return;
    }
    if (!audioUrl || !description) {
      toast({
        variant: "destructive",
        title: "Content not ready",
        description: "Please generate a description before sharing.",
      });
      return;
    }
  
    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const audioFile = new File([blob], "location_description.wav", { type: "audio/wav" });
  
      const shareData = {
        files: [audioFile],
        title: 'BeaconBuddy Location',
        text: `Help me, I'm at: ${description}\n\nHere is my location: ${url}`,
      };

      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else if (navigator.canShare && navigator.canShare({title: shareData.title, text: shareData.text, url: shareData.url})) {
        await navigator.share({title: shareData.title, text: `Help me, I'm at: ${description}`, url: shareData.url});
      }
      else {
        const message = encodeURIComponent(`Help me, I'm at: ${description}\n\nHere is my location: ${url}`);
        window.open(`https://wa.me/?text=${message}`, '_blank');
      }
    } catch (error) {
      console.error("Error sharing audio:", error);
      if (error instanceof DOMException && error.name === 'AbortError') {
        return; // User cancelled the share operation
      }
      toast({
        variant: "destructive",
        title: "Share Error",
        description: "Could not share the audio description. Sharing files may not be supported on your device or browser.",
      });
    }
  };
  

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const onEnded = () => setIsAudioPlaying(false);
      const onPlay = () => setIsAudioPlaying(true);
      const onPause = () => setIsAudioPlaying(false);
      audio.addEventListener('ended', onEnded);
      audio.addEventListener('play', onPlay);
      audio.addEventListener('pause', onPause);
      return () => {
        audio.removeEventListener('ended', onEnded);
        audio.removeEventListener('play', onPlay);
        audio.removeEventListener('pause', onPause);
      };
    }
  }, [audioRef.current]);
  

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      <BeaconMap position={position} />

      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4">
        <h1 className="text-2xl font-headline font-bold text-foreground drop-shadow-lg">BeaconBuddy</h1>
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shadow-lg">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>BeaconBuddy</SheetTitle>
                <SheetDescription>
                  This app helps you share your location when you're lost. Get an AI description of your surroundings or share a direct link with a friend.
                </SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <Separator />
              </div>
              <div className="flex flex-col space-y-2">
                 <Button
                    variant="ghost"
                    className="justify-start gap-2"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  >
                    {theme === 'dark' ? <Sun /> : <Moon />}
                    <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                  </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" className="justify-start gap-2">
                      <Share2 /> Share My Location
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Share Your Location</AlertDialogTitle>
                      <AlertDialogDescription>
                        Anyone with this link will be able to see your location. Share it only with people you trust.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex items-center space-x-2 pt-2">
                      <Input value={createShareUrl() || "Getting location..."} readOnly className="text-sm bg-secondary" />
                      <Button variant="outline" size="icon" onClick={handleCopyUrl} aria-label="Copy link">
                        <ClipboardCopy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={handleShareOnWhatsApp} aria-label="Share on WhatsApp">
                        <WhatsAppIcon className="h-5 w-5" />
                      </Button>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Close</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button variant="ghost" className="justify-start gap-2" asChild>
                  <Link href="tel:"><Phone />Call for Help</Link>
                </Button>
                <Button variant="ghost" className="justify-start gap-2" asChild>
                  <Link href="sms:"><MessageSquare />Send SMS</Link>
                </Button>
                <Button variant="ghost" className="justify-start gap-2" asChild>
                  <Link href="mailto:"><Mail />Send Email</Link>
                </Button>
                <Button variant="ghost" className="justify-start gap-2" disabled={!position} asChild>
                  <Link 
                    href={position ? `https://www.google.com/maps/search/?api=1&query=restaurants&query=${position.lat},${position.lng}` : "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Utensils />Find Nearby Restaurants
                  </Link>
                </Button>
              </div>
            </SheetContent>
        </Sheet>
      </header>

      {geoError && (
        <div className="absolute top-20 left-1/2 z-20 -translate-x-1/2">
            <div className="flex items-center gap-2 rounded-md border bg-destructive/80 p-3 text-sm text-destructive-foreground shadow-lg">
                <AlertTriangle className="h-4 w-4" />
                <span>Location error: {geoError}</span>
            </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-10 w-full p-4">
        <Card className="mx-auto max-w-md border-none bg-background/90 shadow-2xl backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">Get an AI-powered description of your current surroundings.</p>
              <Button onClick={handleDescribeLocation} disabled={isDescriptionLoading || !position} className="w-full">
                {isDescriptionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
                {isDescriptionLoading ? "Generating..." : "Describe My Surroundings"}
              </Button>
              {description && (
                <div className="rounded-md border bg-secondary p-3 text-left text-sm text-secondary-foreground flex items-center gap-2">
                  <p className="flex-1">{description}</p>
                  {audioUrl && (
                      <>
                          <audio ref={audioRef} src={audioUrl} onPlay={() => setIsAudioPlaying(true)} onPause={() => setIsAudioPlaying(false)} onEnded={() => setIsAudioPlaying(false)} />
                          <Button variant="outline" size="icon" onClick={toggleAudio}>
                              {isAudioPlaying ? <Pause className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                          </Button>
                          <Button variant="outline" size="icon" onClick={handleShareAudioOnWhatsApp} aria-label="Share Audio on WhatsApp">
                              <WhatsAppIcon className="h-5 w-5" />
                          </Button>
                      </>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
