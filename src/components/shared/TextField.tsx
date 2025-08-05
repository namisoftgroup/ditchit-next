import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { ReactNode, TextareaHTMLAttributes } from "react";

interface TextFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  id: string;
  error?: ReactNode;
}

export default function TextField({
  label,
  id,
  error,
  ...props
}: TextFieldProps) {
  return (
    <div className="grid w-full items-center gap-1 relative">
      {label && (
        <Label htmlFor={id} className="font-bold flex items-center gap-2 mb-2">
          {label}
        </Label>
      )}

      <Textarea
        id={id}
        {...props}
        className="px-4 min-h-[120px] rounded-[12px] border-[var(--lightBorderColor)]"
      />
      {error && <div className="text-red-500 text-[12px]">{error}</div>}
    </div>
  );
}
