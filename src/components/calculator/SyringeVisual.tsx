import { Card } from "@/components/ui/card";

interface SyringeVisualProps {
  units: number;
}

export const SyringeVisual = ({ units }: SyringeVisualProps) => {
  // Clamp units between 0 and 100
  const clampedUnits = Math.max(0, Math.min(100, units));
  const position = clampedUnits;

  // Generate all tick marks (every 2 units like real syringe)
  const allTicks = Array.from({ length: 51 }, (_, i) => i * 2);
  const majorTicks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]; // Include 0 as major tick

  return (
    <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
      <h3 className="text-2xl font-bold mb-3 text-center">U-100 Insulin Syringe</h3>
      <p className="text-base text-muted-foreground text-center mb-8">
        Draw to the <span className="font-bold text-primary text-xl">{clampedUnits.toFixed(1)} unit</span> mark
      </p>
      
      {/* Syringe barrel visualization */}
      <div className="relative w-full mb-8 overflow-x-auto">
        {/* Syringe barrel background */}
        <div className="relative bg-background border-2 border-foreground/20 rounded-lg overflow-visible min-w-full">
          {/* Numbers above the barrel */}
          <div className="relative h-10">
            {majorTicks.map((mark) => {
              const leftPosition = `calc(${mark}%)`;
              return (
                <div
                  key={`label-${mark}`}
                  className="absolute top-2"
                  style={{ left: leftPosition }}
                >
                  <span className="absolute -translate-x-1/2 text-base font-bold text-foreground">
                    {mark}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* Barrel with tick marks */}
          <div className="relative h-24 bg-card/50 border-t border-foreground/20">
            {/* All tick marks */}
            {allTicks.map((mark) => {
              const isMajor = majorTicks.includes(mark);
              const leftPosition = `calc(${mark}%)`;
              return (
                <div
                  key={`tick-${mark}`}
                  className="absolute top-0 bottom-0"
                  style={{ left: leftPosition }}
                >
                  <div 
                    className={`absolute -translate-x-1/2 ${
                      isMajor 
                        ? 'w-0.5 h-full bg-foreground' 
                        : 'w-px h-2/3 bg-foreground/40 top-[16.67%]'
                    }`}
                  />
                </div>
              );
            })}
            
            {/* Dose indicator line */}
            <div
              className="absolute top-0 bottom-0 transition-all duration-500 z-10"
              style={{ left: `calc(${position}%)` }}
            >
              <div className="relative h-full">
                <div className="absolute -translate-x-1/2 w-1 h-full bg-accent shadow-lg" />
              </div>
            </div>
          </div>
          
          {/* Dose indicator label below */}
          <div className="relative h-14">
            <div
              className="absolute top-4 transition-all duration-500"
              style={{ left: `calc(${position}%)` }}
            >
              <div className="relative -translate-x-1/2">
                <div className="bg-accent text-accent-foreground px-3 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap shadow-lg">
                  ↑ Draw to {clampedUnits.toFixed(1)}
                </div>
              </div>
            </div>
          </div>
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
