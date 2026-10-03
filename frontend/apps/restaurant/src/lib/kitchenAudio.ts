import { useState, useEffect, useCallback } from "react";

// Web Audio API based Kitchen Notification Sound Generator
// Generates clean bell chimes without relying on external mp3 assets

class KitchenAudioAlert {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private intervalId: number | null = null;
  private listeners: Set<(enabled: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sat_kitchen_sound_enabled");
      this.soundEnabled = saved !== null ? saved === "true" : true;

      window.addEventListener("storage", (e) => {
        if (e.key === "sat_kitchen_sound_enabled" && e.newValue !== null) {
          const next = e.newValue === "true";
          if (this.soundEnabled !== next) {
            this.soundEnabled = next;
            if (!next) {
              this.stopLoop();
            }
            this.listeners.forEach((fn) => fn(next));
          }
        }
      });
    }
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public setEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    try {
      localStorage.setItem("sat_kitchen_sound_enabled", String(enabled));
    } catch {
      // Storage quota or privacy sandbox catch
    }
    if (!enabled) {
      this.stopLoop();
    }
    this.listeners.forEach((fn) => fn(enabled));
  }

  public subscribe(fn: (enabled: boolean) => void): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  public unlock() {
    this.initContext();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  public playChime() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // High chime
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880.0, now + 0.15); // A5
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.6);

      // Harmonizing second tone
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(880.0, now + 0.15);
      osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.3); // D6
      gain2.gain.setValueAtTime(0.25, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.7);
    } catch {
      // Audio autoplay policy catch
    }
  }

  public startLoopIfNewOrders(hasNewOrders: boolean) {
    if (!hasNewOrders || !this.soundEnabled) {
      this.stopLoop();
      return;
    }

    if (this.intervalId === null) {
      this.playChime();
      this.intervalId = window.setInterval(() => {
        this.playChime();
      }, 2000);
    }
  }

  public stopLoop() {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const kitchenAlert = new KitchenAudioAlert();

/**
 * React hook to reactively read and toggle global kitchen order sound notification state.
 */
export function useKitchenSound() {
  const [soundEnabled, setSoundEnabled] = useState(() => kitchenAlert.isEnabled());

  useEffect(() => {
    return kitchenAlert.subscribe(setSoundEnabled);
  }, []);

  const toggleSound = useCallback(() => {
    const next = !kitchenAlert.isEnabled();
    kitchenAlert.setEnabled(next);
    if (next) kitchenAlert.playChime();
  }, []);

  return { soundEnabled, toggleSound };
}
