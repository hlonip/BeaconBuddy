import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InvalidBeaconPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="items-center">
          <ShieldAlert className="h-12 w-12 text-destructive mb-2"/>
          <CardTitle className="font-headline text-2xl">Invalid Link</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            The BeaconBuddy link you followed is incomplete or invalid. Please check the link and try again.
          </p>
          <Button asChild>
            <Link href="/" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Return to BeaconBuddy Home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
