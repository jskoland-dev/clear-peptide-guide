import { Card } from "@/components/ui/card";

interface SyringeVisualProps {
  units: number;
}

export const SyringeVisual = ({ units }: SyringeVisualProps) => {
  // Clamp units between 0 and 100
  const clampedUnits = Math.max(0, Math.min(100, units));
  const position = clampedUnits;

  return (
    <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
      <h3 className="text-2xl font-bold mb-3 text-center">U-100 Insulin Syringe</h3>
      <p className="text-base text-muted-foreground text-center mb-8">
        Draw to the <span className="font-bold text-primary text-xl">{clampedUnits.toFixed(1)} unit</span> mark
      </p>
      
      {/* Horizontal syringe ruler */}
      <div className="relative w-full h-32 mb-6">
        {/* Main ruler line */}
        <div className="absolute bottom-12 left-0 right-0 h-2 bg-border rounded-full" />
        
        {/* Tick marks and labels */}
        <div className="relative h-full">
          {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((mark) => {
            const leftPosition = `${mark}%`;
            return (
              <div
                key={mark}
                className="absolute bottom-8"
                style={{ left: leftPosition }}
              >
                {/* Major tick */}
                <div className="relative">
                  <div className="absolute -translate-x-1/2 w-0.5 h-8 bg-foreground" />
                  <span className="absolute top-10 -translate-x-1/2 text-sm font-semibold text-foreground">
                    {mark}
                  </span>
                </div>
              </div>
            );
          })}
          
          {/* Minor ticks (every 5 units) */}
          {[5, 15, 25, 35, 45, 55, 65, 75, 85, 95].map((mark) => {
            const leftPosition = `${mark}%`;
            return (
              <div
                key={mark}
                className="absolute bottom-8"
                style={{ left: leftPosition }}
              >
                <div className="absolute -translate-x-1/2 w-0.5 h-4 bg-foreground/50" />
              </div>
            );
          })}
          
          {/* Dose indicator */}
          <div
            className="absolute bottom-4 transition-all duration-500"
            style={{ left: `${position}%` }}
          >
            <div className="relative -translate-x-1/2">
              {/* Indicator line */}
              <div className="w-1 h-16 bg-accent rounded-full shadow-lg" />
              {/* Indicator label */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-3 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap shadow-lg">
                Draw to here
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-foreground rounded" />
          <span className="text-muted-foreground">Syringe marks</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-accent rounded" />
          <span className="font-bold">Your dose</span>
        </div>
      </div>
      
      <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
        <p className="text-sm text-center">
          <span className="font-semibold">💉 Using U-100 Syringe:</span> Draw the liquid up to the{" "}
          <span className="font-bold text-primary">{clampedUnits.toFixed(1)}</span> unit marking on your syringe
        </p>
      </div>
    </Card>
  );
};
