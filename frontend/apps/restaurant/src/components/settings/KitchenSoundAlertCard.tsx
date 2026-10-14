import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Toggle from "@/components/common/Toggle";
import { useKitchenSound, kitchenAlert } from "@/lib/kitchenAudio";
import { HugeiconsIcon } from "@hugeicons/react";
import { VolumeHighIcon, VolumeOffIcon, PlayIcon } from "@hugeicons/core-free-icons";

export function KitchenSoundAlertCard() {
  const { soundEnabled, toggleSound } = useKitchenSound();

  const handleTestChime = () => {
    kitchenAlert.unlock();
    kitchenAlert.playChime();
  };

  return (
    <Card className="shadow-2xs border-border bg-card">
      <CardHeader className="p-4 sm:p-5 border-b border-border/60">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <HugeiconsIcon
              icon={soundEnabled ? VolumeHighIcon : VolumeOffIcon}
              strokeWidth={2}
              className="w-4 h-4 text-primary"
            />
            Global Order Sound Alerts
          </CardTitle>
          <Toggle on={soundEnabled} onChange={toggleSound} />
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          Chimes continuously across all screens (and background tabs) when incoming orders await
          kitchen confirmation.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-foreground">
            Status: {soundEnabled ? "Sound Alerts Active (Every 7s)" : "Sound Alerts Muted"}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Audio repeats every 7 seconds until orders are accepted or cancelled.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleTestChime}
          className="gap-1.5 text-xs h-8 shrink-0"
        >
          <HugeiconsIcon icon={PlayIcon} strokeWidth={2} className="w-3.5 h-3.5 text-primary" />
          Test Kitchen Bell
        </Button>
      </CardContent>
    </Card>
  );
}
