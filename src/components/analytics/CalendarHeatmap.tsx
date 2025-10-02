import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Injection {
  injection_date: string;
}

interface CalendarHeatmapProps {
  injections: Injection[];
}

export function CalendarHeatmap({ injections }: CalendarHeatmapProps) {
  // Get last 12 weeks of data
  const weeks = 12;
  const days = weeks * 7;
  
  const getDateString = (daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
  };

  const injectionCounts = injections.reduce((acc, inj) => {
    const date = inj.injection_date.split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const maxCount = Math.max(...Object.values(injectionCounts), 1);

  const getIntensity = (count: number) => {
    if (count === 0) return 'bg-muted/30';
    const intensity = count / maxCount;
    if (intensity <= 0.25) return 'bg-primary/30';
    if (intensity <= 0.5) return 'bg-primary/50';
    if (intensity <= 0.75) return 'bg-primary/70';
    return 'bg-primary';
  };

  const weeks_data = [];
  for (let week = weeks - 1; week >= 0; week--) {
    const week_days = [];
    for (let day = 0; day < 7; day++) {
      const daysAgo = week * 7 + day;
      const dateString = getDateString(daysAgo);
      const count = injectionCounts[dateString] || 0;
      week_days.push({ date: dateString, count });
    }
    weeks_data.push(week_days);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Injection Calendar</CardTitle>
        <CardDescription>Last {weeks} weeks of activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="grid grid-cols-7 gap-2 text-xs text-center text-muted-foreground mb-2">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>
          <div className="space-y-2">
            {weeks_data.map((week, weekIdx) => (
              <div key={weekIdx} className="grid grid-cols-7 gap-2">
                {week.map((day, dayIdx) => (
                  <div
                    key={dayIdx}
                    className={`aspect-square rounded ${getIntensity(day.count)} transition-colors hover:ring-2 hover:ring-primary cursor-pointer`}
                    title={`${day.date}: ${day.count} injection${day.count !== 1 ? 's' : ''}`}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground mt-4">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded bg-muted/30" />
              <div className="w-3 h-3 rounded bg-primary/30" />
              <div className="w-3 h-3 rounded bg-primary/50" />
              <div className="w-3 h-3 rounded bg-primary/70" />
              <div className="w-3 h-3 rounded bg-primary" />
            </div>
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
