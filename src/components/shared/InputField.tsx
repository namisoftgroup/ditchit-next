import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error: string | undefined;
}

export default function InputField({
  label,
  id,
  error,
  ...props
}: InputFieldProps) {
  return (
    <div className="grid w-full items-center gap-1">
      <Label htmlFor={id} className="font-bold flex items-center gap-2 mb-2">
        {label}
      </Label>

      <Input
        id={id}
        {...props}
        className="px-4 h-[48px] rounded-[12px] border-[var(--lightBorderColor)]"
      />
      {error && <div className="text-red-500 text-[12px]">{error}</div>}
    </div>
  );
}
