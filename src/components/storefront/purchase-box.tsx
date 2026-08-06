'use client';

import { useActionState, useState } from 'react';
import { addToCartAction, type AddToCartState } from '@/app/actions/cart';
import type { ProductVariant } from '@/lib/catalog-types';
import type { Dictionary } from '@/lib/dictionaries';

function variantLabel(variant: ProductVariant): string {
  return [variant.size, variant.color].filter(Boolean).join(' / ') || variant.sku;
}

export function PurchaseBox({
  variants,
  basePrice,
  dict,
}: {
  variants: ProductVariant[];
  basePrice: string;
  dict: Dictionary;
}) {
  const firstInStock = variants.find((v) => v.stockQuantity > 0) ?? variants[0];
  const [selectedId, setSelectedId] = useState(firstInStock?.id);
  const [quantity, setQuantity] = useState(1);

  const selected = variants.find((v) => v.id === selectedId) ?? variants[0];
  const price = Number(selected?.priceOverride ?? basePrice);
  const outOfStock = !selected || selected.stockQuantity === 0;

  const boundAction = addToCartAction.bind(null, selected?.id ?? '');
  const [state, action, pending] = useActionState<AddToCartState, FormData>(
    boundAction,
    undefined,
  );

  function selectVariant(variant: ProductVariant) {
    setSelectedId(variant.id);
    setQuantity(1);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-brand-red">
          ฿{price.toLocaleString()}
        </span>
      </div>

      {variants.length > 1 && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold">{dict.product.selectVariant}</span>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                type="button"
                disabled={v.stockQuantity === 0}
                onClick={() => selectVariant(v)}
                className={`text-sm font-semibold px-4 py-2 rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  v.id === selectedId
                    ? 'border-brand-red bg-[#fff5f6] text-brand-red'
                    : 'border-border-subtle hover:border-brand-red'
                }`}
              >
                {variantLabel(v)}
                {v.stockQuantity === 0 && dict.product.outOfStockSuffix}
              </button>
            ))}
          </div>
        </div>
      )}

      <span className="text-sm font-semibold text-text-faint">
        {outOfStock
          ? dict.product.outOfStock
          : dict.product.inStock.replace('{count}', String(selected.stockQuantity))}
      </span>

      <div className="flex items-center gap-4">
        <div className="flex items-center border border-border-subtle rounded-lg overflow-hidden">
          <button
            type="button"
            aria-label={dict.common.decrease}
            disabled={outOfStock}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="border-0 bg-white px-4 py-3 text-lg font-bold cursor-pointer disabled:opacity-40"
          >
            −
          </button>
          <span className="min-w-[44px] text-center text-sm font-bold">{quantity}</span>
          <button
            type="button"
            aria-label={dict.common.increase}
            disabled={outOfStock || quantity >= (selected?.stockQuantity ?? 0)}
            onClick={() =>
              setQuantity((q) => Math.min(selected?.stockQuantity ?? 1, q + 1))
            }
            className="border-0 bg-white px-4 py-3 text-lg font-bold cursor-pointer disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>

      <form action={action} className="flex flex-col gap-2">
        <input type="hidden" name="quantity" value={quantity} />
        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        {state?.success && (
          <p className="text-sm text-green-700">{dict.product.addedToCart}</p>
        )}
        <button
          type="submit"
          disabled={outOfStock || pending}
          className="w-full bg-brand-red text-white text-lg font-bold py-4 rounded-lg hover:bg-brand-red-dark transition-colors disabled:opacity-50"
        >
          {pending ? dict.product.addingToCart : dict.product.addToCart}
        </button>
      </form>

      <div className="flex flex-col gap-1 border-t border-[#f0f4f8] pt-4 text-sm font-semibold text-text-muted">
        <span>{dict.product.trustWarranty}</span>
        <span>{dict.common.paymentNote}</span>
        <span>{dict.common.freeShippingBanner}</span>
      </div>
    </div>
  );
}
