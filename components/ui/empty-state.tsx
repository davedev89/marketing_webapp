import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type EmptyStateProps = {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export function EmptyState({ title, description, ctaLabel, ctaHref }: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-start gap-4 border-dashed">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
      {ctaLabel && ctaHref ? (
        <Link href={ctaHref as never}>
          <Button>{ctaLabel}</Button>
        </Link>
      ) : null}
    </Card>
  );
}
