interface StatsCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

export function StatsCard({ label, value, icon }: StatsCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">{label}</p>
          <p className="mt-1 text-card-foreground">{value}</p>
        </div>
        <div className="text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
}
