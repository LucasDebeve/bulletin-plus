import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils.ts';

type TemplateCardProps = {
  title: string;
  children?: ReactNode;
  className?: string;
  'aria-label'?: string;
};

function ChartCard({
  title,
  children,
  className,
  'aria-label': ariaLabel,
}: TemplateCardProps) {
  return (
    <Card aria-label={ariaLabel} className={cn('flex flex-col', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className={'flex-1'}>{children}</CardContent>
    </Card>
  );
}

export default ChartCard;
