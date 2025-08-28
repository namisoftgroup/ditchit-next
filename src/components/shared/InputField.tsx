import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  error?: string | undefined;
}

export default function InputField({
  label,
  id,
  error,
  ...props
}: InputFieldProps) {
  return (
    <div className="grid w-full items-center gap-1 relative">
      {label && (
        <Label htmlFor={id} className="font-bold flex items-center gap-2 mb-2">
          {label}
        </Label>
      )}

      <Input
        id={id}
        {...props}
        className={`px-4 h-[48px] rounded-[12px] border-[var(--lightBorderColor)] ${id === "phone" ? "ps-10" : ""}`}
      />
      {id === "phone" && (
        <span className="font-bold text-[var(--mainColor)] absolute start-4 top-[38px] transform">
          +1
        </span>
      )}
      {error && <div className="text-red-500 text-[12px]">{error}</div>}
    </div>
  );
}
