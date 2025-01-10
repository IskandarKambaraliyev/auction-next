import { Input } from "./ui/input";

type InputProps = {
  id: string;
  name?: string;
  label: string;
  type?: string;
  value?: string;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  error?: string | null;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
export const CustomInput = ({
  id,
  name,
  label,
  type = "text",
  value,
  autoComplete = "off",
  required = true,
  minLength,
  maxLength,
  error,
  onChange,
}: InputProps) => {
  return (
    <div className="space-y-1">
      <label htmlFor={id}>{label}</label>
      <div className="relative w-full">
        <Input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};
