'use client';

import { useRef, useState, useTransition } from 'react';
import { uploadImageAction } from '@/app/actions/admin-catalog';

export function ImageUploadForm({ productId }: { productId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      ref={formRef}
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          try {
            await uploadImageAction(productId, formData);
            formRef.current?.reset();
          } catch (err) {
            setError(err instanceof Error ? err.message : 'อัปโหลดรูปภาพไม่สำเร็จ');
          }
        });
      }}
      className="flex items-center gap-3 border rounded p-3"
    >
      <input type="file" name="file" accept="image/jpeg,image/png,image/webp" required />
      <label className="flex items-center gap-1 text-sm">
        <input type="checkbox" name="isPrimary" /> รูปหลัก
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="bg-black text-white rounded px-3 py-1 text-sm disabled:opacity-50"
      >
        {isPending ? 'กำลังอัปโหลด...' : 'อัปโหลด'}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
