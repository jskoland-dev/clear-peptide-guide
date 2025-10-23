import { Card } from "@/components/ui/card";

interface SyringeVisualProps {
  units: number;
}

export const SyringeVisual = ({ units }: SyringeVisualProps) => {
  // Clamp units between 0 and 100
  const clampedUnits = Math.max(0, Math.min(100, units));
  const fillPercentage = clampedUnits;

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
      <h3 className="text-xl font-bold mb-4 text-center">U-100 Insulin Syringe</h3>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Draw to the <span className="font-bold text-primary">{clampedUnits.toFixed(1)} unit</span> mark
      </p>
      
      <div className="flex items-center justify-center gap-4">
        {/* Syringe visualization */}
        <div className="relative">
          {/* Plunger */}
          <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-3 bg-muted border border-border rounded-l-sm" />
          
          {/* Barrel */}
          <div className="relative w-16 h-80 bg-background border-2 border-border rounded-b-lg overflow-hidden">
            {/* Filled liquid */}
            <div 
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary to-primary/60 transition-all duration-500"
              style={{ height: `${fillPercentage}%` }}
            />
            
            {/* Major markings (every 10 units) */}
            {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((mark) => (
              <div
                key={mark}
                className="absolute left-0 right-0 border-t-2 border-foreground/40"
                style={{ bottom: `${mark}%` }}
              >
                <span className="absolute -left-10 -translate-y-1/2 text-xs font-semibold text-foreground">
                  {mark}
                </span>
              </div>
            ))}
            
            {/* Minor markings (every 5 units) */}
            {[5, 15, 25, 35, 45, 55, 65, 75, 85, 95].map((mark) => (
              <div
                key={mark}
                className="absolute left-0 w-1/3 border-t border-foreground/30"
                style={{ bottom: `${mark}%` }}
              />
            ))}
            
            {/* Target line indicator */}
            <div
              className="absolute left-0 right-0 border-t-4 border-accent z-10"
              style={{ bottom: `${fillPercentage}%` }}
            >
              <div className="absolute -right-16 -translate-y-1/2 bg-accent text-accent-foreground px-2 py-1 rounded text-sm font-bold whitespace-nowrap">
                Draw to here →
              </div>
            </div>
          </div>
          
          {/* Needle */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-12 w-1 h-12 bg-gradient-to-b from-muted to-muted/50" />
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-16 w-0 h-0 border-l-[3px] border-r-[3px] border-t-[8px] border-transparent border-t-muted/50" />
        </div>
        
        {/* Labels */}
        <div className="text-sm space-y-2 text-muted-foreground ml-12">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary rounded" />
            <span>Liquid level</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-accent rounded" />
            <span className="font-bold text-accent-foreground">Your dose</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
        <p className="text-sm text-center">
          <span className="font-semibold">💉 Using U-100 Syringe:</span> Draw the liquid up to the{" "}
          <span className="font-bold text-primary">{clampedUnits.toFixed(1)}</span> unit marking on your syringe
        </p>
      </div>
    </Card>
  );
};
