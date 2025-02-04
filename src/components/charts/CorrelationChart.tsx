import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart.tsx';
import { Legend, Scatter, ScatterChart, XAxis, YAxis } from 'recharts';
import { MergedMatieresAverage } from '@/types/notes';

const chartConfig = {
  notes: {
    label: 'Notes',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

function CorrelationChart({ data }: { data: MergedMatieresAverage[] }) {
  console.log(data);

  return (
    <ChartContainer config={chartConfig} className={'w-full h-full'}>
      <ScatterChart accessibilityLayer data={data}>
        <XAxis dataKey="coef" type={'number'} name={'Coefficient'} />
        <YAxis dataKey="currentAverage" type={'number'} name={'Note'} />
        <Legend />
        <ChartTooltip
          cursor={{ strokeDasharray: '3 3' }}
          content={<ChartTooltipContent />}
        />
        <Scatter
          name={chartConfig.notes.label}
          dataKey="currentAverage"
          fill={'var(--color-notes)'}
          fillOpacity={0.5}
        />
      </ScatterChart>
    </ChartContainer>
  );
}

export default CorrelationChart;
