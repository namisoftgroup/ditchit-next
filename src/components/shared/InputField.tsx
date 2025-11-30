import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Eye, EyeOff } from "lucide-react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  error?: string | undefined;
}

export default function InputField({
  label,
  id,
  error,
  type = "text",
  ...props
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  // نحدد ما إذا كان الحقل من نوع password
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;
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
        type={inputType}
        className={`px-4 h-[48px] rounded-[12px] border-[var(--lightBorderColor)] ${id === "phone" ? "" : ""} ${props.disabled ? "bg-gray-300 cursor-not-allowed" : ""} `}
      />
      {/* {id === "phone" && (
        <span className="font-bold text-[var(--mainColor)] absolute start-4 top-[38px] transform">
          +1
        </span>
      )} */}
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 translate-y-1 text-gray-500"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
      {error && <div className="text-red-500 text-[12px]">{error}</div>}
    </div>
  );
}
