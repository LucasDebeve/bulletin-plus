import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { MoveUpRight, MoveDownRight, Equal } from 'lucide-react';
import { cn } from '@/lib/utils.ts';

type StatsCardProps = {
  value: number;
  description: string;
  oldValue?: number;
  isPourcentage?: boolean;
};

function StatsCard({
  value,
  description,
  oldValue,
  isPourcentage = true,
}: StatsCardProps) {
  const hasOldValue = oldValue !== undefined;
  if (oldValue === undefined) {
    oldValue = value;
  }
  const isPositive = value > oldValue;
  const isEqual = value === oldValue;
  const pourcentage =
    Math.abs(((value - oldValue) / oldValue) * 100).toFixed(2) || 0;
  // Remove trailing zeros

  return (
    <Card>
      <CardHeader className={'pb-0'}>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className={'pb-0'}>
        <CardTitle className={'text-4xl font-medium'}>
          {value.toLocaleString()}
        </CardTitle>
      </CardContent>
      <CardFooter>
        {hasOldValue && (
          <CardDescription>
            <span
              className={cn(
                'font-medium',
                isPositive
                  ? 'text-green-500'
                  : isEqual
                    ? 'text-muted-foreground'
                    : 'text-destructive'
              )}
            >
              {!isEqual && (
                <>
                  {isPourcentage
                    ? `${pourcentage.toLocaleString()}% `
                    : Math.abs(value - oldValue).toLocaleString()}
                </>
              )}
              {isPositive ? (
                <>
                  d'augmentation
                  <MoveUpRight className={'inline-block ml-1 h-5'} />
                </>
              ) : isEqual ? (
                <>
                  stable
                  <Equal className={'inline-block ml-1 h-5'} />
                </>
              ) : (
                <>
                  de diminution
                  <MoveDownRight className={'inline-block ml-1 h-5'} />
                </>
              )}
            </span>
          </CardDescription>
        )}
      </CardFooter>
    </Card>
  );
}

export default StatsCard;
