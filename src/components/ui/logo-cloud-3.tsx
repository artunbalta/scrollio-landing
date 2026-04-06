import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { cn } from "@/lib/utils";

type TopicTag = {
  label: string;
  color?: string;
};

type TopicCloudProps = React.ComponentProps<"div"> & {
  tags: TopicTag[];
  speed?: number;
  reverse?: boolean;
};

export function TopicCloud({ className, tags, speed = 60, reverse = false, ...props }: TopicCloudProps) {
  return (
    <div
      {...props}
      className={cn(
        "overflow-hidden py-3 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]",
        className
      )}
    >
      <InfiniteSlider gap={12} speed={speed} reverse={reverse}>
        {tags.map((tag) => (
          <span
            key={tag.label}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border select-none pointer-events-none"
            style={{
              background: tag.color
                ? `${tag.color}15`
                : "rgba(249,115,22,0.1)",
              borderColor: tag.color
                ? `${tag.color}30`
                : "rgba(249,115,22,0.2)",
              color: tag.color ?? "var(--accent)",
            }}
          >
            {tag.label}
          </span>
        ))}
      </InfiniteSlider>
    </div>
  );
}
