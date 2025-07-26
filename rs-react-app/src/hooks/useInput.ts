import { useState } from 'react';
import type { ChangeEvent } from 'react';

export interface UseInputReturn {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function useInput(defaultValue = ''): UseInputReturn {
  const [value, setValue] = useState(defaultValue);
  return {
    value,
    onChange: (event: ChangeEvent<HTMLInputElement>) =>
      setValue(event.target.value),
  };
}
