import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = {
  label: string;
  value: string;
};

type SelectFieldProps = {
  label: string;
  id: string;
  value?: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  error?: string;
};

export default function SelectField({
  label,
  id,
  value,
  onChange,
  options,
  placeholder,
  error,
}: SelectFieldProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="font-bold text-sm mb-2">
        {label}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className="w-full px-4 !h-[48px] rounded-[12px] border-[var(--lightBorderColor)]"
          id={id}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-[12px] text-red-500">{error}</p>}
    </div>
  );
}
