import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';

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
    <Card aria-label={ariaLabel} className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default ChartCard;
