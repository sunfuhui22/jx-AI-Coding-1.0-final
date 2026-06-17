interface BarItem {
  label: string;
  value: number;
  color: string;
}

interface SimpleBarChartProps {
  data: BarItem[];
  title?: string;
}

export function SimpleBarChart({ data, title }: SimpleBarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div>
      {title && (
        <h3 className="mb-4 text-[13px] font-semibold text-foreground">
          {title}
        </h3>
      )}
      <div className="flex items-end gap-5" style={{ height: 200 }}>
        {data.map((item) => {
          const h = Math.round((item.value / max) * 160);
          return (
            <div
              key={item.label}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <span className="text-sm font-bold text-foreground tabular-nums">
                {item.value}
              </span>
              <div
                className="w-full rounded-t-md transition-all duration-300 hover:opacity-80"
                style={{
                  height: `${h}px`,
                  backgroundColor: item.color,
                  minHeight: item.value > 0 ? 8 : 0,
                }}
              />
              <span className="text-[11px] text-muted-foreground text-center font-medium">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
