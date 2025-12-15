import { ALL_MODIFIERS, MODIFIER_BACKGROUNDS } from "@/data/modifiers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DebugModifiers() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Modifier Debug View</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ALL_MODIFIERS.map((mod) => (
          <Card key={mod.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="font-mono">{mod.id}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-square w-full max-w-[300px] mx-auto border rounded-md overflow-hidden">
                {/* Background SVG */}
                <div 
                  className="absolute inset-0 z-0"
                  style={{
                    backgroundImage: `url("${MODIFIER_BACKGROUNDS[mod.id] || MODIFIER_BACKGROUNDS.empty}")`,
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                  }}
                />
                
                {/* Zone Overlay */}
                <div className="absolute inset-0 z-10 grid grid-cols-10 grid-rows-10">
                  {Array.from({ length: 100 }).map((_, idx) => {
                    const isZone = mod.zones.includes(idx);
                    return (
                      <div 
                        key={idx}
                        className={`
                          border-[0.5px] border-black/5
                          ${isZone ? "bg-red-500/30" : "bg-transparent"}
                        `}
                        title={isZone ? `Zone ${idx}` : undefined}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="mt-2 text-xs font-mono text-muted-foreground">
                Zones: {mod.zones.length}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
