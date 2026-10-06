import { MIM_PATH, MIM_TRANSFORM, MIM_VIEWBOX } from "@/lib/mim";

export function Logo({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox={`0 0 ${MIM_VIEWBOX.w} ${MIM_VIEWBOX.h}`}
      className={className}
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <g transform={MIM_TRANSFORM} stroke="none">
        <path d={MIM_PATH} />
      </g>
    </svg>
  );
}
