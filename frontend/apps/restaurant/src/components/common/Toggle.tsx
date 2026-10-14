import { Switch } from "@/components/ui/switch";

export interface ToggleProps {
  on: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export default function Toggle({ on, onChange, disabled, className }: ToggleProps) {
  return (
    <Switch checked={on} onCheckedChange={onChange} disabled={disabled} className={className} />
  );
}
