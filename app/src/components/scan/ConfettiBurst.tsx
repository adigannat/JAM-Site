interface ConfettiBurstProps {
  active: boolean;
}

const colors = ["#5A39F4", "#3AD59A", "#F6B73C", "#FF5C5C", "#877CFE"];

export function ConfettiBurst({ active }: ConfettiBurstProps): JSX.Element | null {
  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 36 }).map((_, index) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.4;
        const duration = 1.7 + Math.random() * 0.6;
        const bg = colors[index % colors.length];
        const rotate = Math.random() * 360;

        return (
          <span
            key={index}
            style={{
              left: `${left}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              backgroundColor: bg,
              transform: `rotate(${rotate}deg)`
            }}
            className="confetti-piece absolute top-0 block h-2 w-1 rounded-full opacity-0"
          />
        );
      })}
    </div>
  );
}
