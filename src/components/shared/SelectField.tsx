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
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
};

export default function SelectField({
  label,
  id,
  value,
  onChange,
  options,
  placeholder,
  error,
  onLoadMore,
  hasMore = false,
  loading = false,
}: SelectFieldProps) {
  const handleScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    const target = e.currentTarget;
    const threshold = 16; // px from bottom
    const reachedBottom =
      target.scrollTop + target.clientHeight >= target.scrollHeight - threshold;

    if (reachedBottom && hasMore && !loading) {
      onLoadMore?.();
    }
  };
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
        <SelectContent onScroll={handleScroll} onViewportScroll={handleScroll} className="max-h-60">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
          {loading && (
            <div className="px-2 py-2 text-xs text-gray-500">Loading…</div>
          )}
          {!loading && !hasMore && options.length > 0 && (
            <div className="px-2 py-2 text-[11px] text-gray-400">No more results</div>
          )}
        </SelectContent>
      </Select>
      {error && <p className="text-[12px] text-red-500">{error}</p>}
    </div>
  );
}
