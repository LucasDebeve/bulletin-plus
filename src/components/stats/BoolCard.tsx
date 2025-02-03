import TemplateCard from '@/components/stats/TemplateCard.tsx';
import { BadgeCheck, BadgeX } from 'lucide-react';

type BoolCardProps = {
  value: boolean;
  description: string;
  'aria-label'?: string;
};

function BoolCard({
  value,
  description,
  'aria-label': ariaLabel,
}: BoolCardProps) {
  return (
    <TemplateCard
      title={
        value ? (
          <BadgeCheck className={'inline-block text-green-500 size-9'} />
        ) : (
          <BadgeX className={'inline-block text-red-500 size-9'} />
        )
      }
      description={description}
      aria-label={ariaLabel}
    />
  );
}

export default BoolCard;
