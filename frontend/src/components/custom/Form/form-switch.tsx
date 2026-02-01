// components/ui/SwitchField.tsx
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SwitchFieldProps {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export function FormSwitch({
  id,
  label,
  checked,
  onCheckedChange,
  className = "",
  disabled = false,
}: SwitchFieldProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
}
