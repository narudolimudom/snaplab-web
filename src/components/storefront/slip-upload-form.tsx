'use client';

import { useRef, useState, useTransition } from 'react';
import { uploadSlipAction } from '@/app/actions/payment-slips';
import type { Dictionary } from '@/lib/dictionaries';

export function SlipUploadForm({ orderId, dict }: { orderId: string; dict: Dictionary }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(
    null,
  );

  return (
    <form
      ref={formRef}
      action={(formData) => {
        setMessage(null);
        startTransition(async () => {
          const result = await uploadSlipAction(orderId, formData);
          if (result?.error) {
            setMessage({ type: 'error', text: result.error });
          } else {
            setMessage({ type: 'success', text: dict.confirmation.slipUploadSuccess });
            formRef.current?.reset();
          }
        });
      }}
      className="flex flex-col gap-3"
    >
      <label htmlFor="slip-file" className="text-sm font-bold">
        {dict.confirmation.attachSlipLabel}
      </label>
      <input
        id="slip-file"
        type="file"
        name="file"
        accept="image/jpeg,image/png,image/webp"
        required
        className="text-sm"
      />
      <button
        type="submit"
        disabled={isPending}
        className="w-fit bg-brand-red text-white text-sm font-bold px-6 py-3 rounded-lg hover:bg-brand-red-dark transition-colors disabled:opacity-50"
      >
        {isPending ? dict.common.uploading : dict.confirmation.uploadSlipButton}
      </button>
      {message && (
        <p className={`text-sm ${message.type === 'error' ? 'text-red-600' : 'text-green-700'}`}>
          {message.text}
        </p>
      )}
    </form>
  );
}
