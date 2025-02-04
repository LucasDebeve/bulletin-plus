import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart.tsx';
import { Legend, PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';
import { type ChartConfig } from '@/components/ui/chart';
import { MergedMatieresAverage } from '@/types/notes';
import { getBeforePipe } from '@/lib/utils.ts';

const chartConfig = {
  current: {
    label: 'Moyenne actuelle',
    color: 'hsl(var(--chart-1))',
  },
  old: {
    label: 'Ancienne moyenne',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

function RadarMeansMatieres({
  mergedData,
}: {
  mergedData: MergedMatieresAverage[];
}) {
  const old_data = mergedData.find((d) => d.oldAverage !== null);

  return (
    <ChartContainer config={chartConfig} className={'w-full'}>
      <RadarChart accessibilityLayer data={mergedData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="matiere" tickFormatter={getBeforePipe} />
        <Radar
          name={chartConfig.current.label}
          dataKey="currentAverage"
          stroke={'var(--color-current)'}
          fill={'var(--color-current)'}
          fillOpacity={0.3}
        />
        {old_data && (
          <Radar
            name={'Anciennes moyennes'}
            dataKey="oldAverage"
            stroke={'var(--color-old)'}
            fill={'var(--color-old)'}
            fillOpacity={0.3}
          />
        )}
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={(value, name) => (
                <div className="flex w-full min-w-[130px] items-center text-xs text-muted-foreground">
                  {chartConfig[name as keyof typeof chartConfig]?.label || name}
                  <div className="pl-4 ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                    {value}
                    <span className="font-normal text-muted-foreground">
                      /20
                    </span>
                  </div>
                </div>
              )}
            />
          }
        />
        <Legend />
      </RadarChart>
    </ChartContainer>
  );
}

export default RadarMeansMatieres;
