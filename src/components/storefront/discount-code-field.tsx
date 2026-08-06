'use client';

import { useState } from 'react';
import type { Dictionary } from '@/lib/dictionaries';

export function DiscountCodeField({ dict }: { dict: Dictionary }) {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder={dict.cart.discountPlaceholder}
          aria-label={dict.cart.discountAriaLabel}
          className="flex-1 border border-border-subtle rounded-lg px-4 py-3 text-sm font-semibold outline-none"
        />
        <button
          type="button"
          onClick={() => setMessage(dict.cart.discountComingSoon)}
          className="flex-none whitespace-nowrap border border-navy bg-white text-navy text-sm font-bold px-4 py-3 rounded-lg cursor-pointer"
        >
          {dict.cart.applyCode}
        </button>
      </div>
      {message && <p className="text-sm text-text-faint">{message}</p>}
    </div>
  );
}
