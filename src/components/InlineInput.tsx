import { useState, useRef, useEffect, useCallback } from "react";

interface InlineInputProps {
  value: string;
  onSave: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const InlineInput = ({ value, onSave, placeholder, className = "" }: InlineInputProps) => {
  const [local, setLocal] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  const save = useCallback(
    (v: string) => {
      if (v !== value) onSave(v);
    },
    [value, onSave]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setLocal(v);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => save(v), 500);
  };

  const handleBlur = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    save(local);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <input
      value={local}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={`bg-transparent border border-transparent focus:border-[#FF6B1A]/30 focus:outline-none rounded px-2 py-1 text-sm transition-colors ${className}`}
      style={{ color: "#2D1E0E", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    />
  );
};

export default InlineInput;
