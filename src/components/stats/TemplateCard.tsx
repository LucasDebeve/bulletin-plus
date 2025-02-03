import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { ReactNode } from 'react';

type TemplateCardProps = {
  title: ReactNode;
  description: string;
  children?: ReactNode;
  'aria-label'?: string;
};

function TemplateCard({
  title,
  description,
  children,
  'aria-label': ariaLabel,
}: TemplateCardProps) {
  return (
    <Card aria-label={ariaLabel}>
      <CardHeader className={'pb-0'}>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className={children ? 'pb-0' : 'pb-6'}>
        <CardTitle className={'text-4xl font-medium'}>{title}</CardTitle>
        {children}
      </CardContent>
    </Card>
  );
}

export default TemplateCard;
