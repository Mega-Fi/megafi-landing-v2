import { cn } from "@/lib/utils";

export type GridBackgroundProps = {
  /** Background variant: 'black' for dark grid, 'white' for light grid with magenta orb */
  variant?: "black" | "white";
  /** Additional CSS classes */
  className?: string;
  /** Children to render on top of the background */
  children?: React.ReactNode;
};

/**
 * GridBackground Component
 * 
 * Renders a full-screen grid background with optional gradient orb.
 * 
 * Variants:
 * - 'black': Black background with subtle gray grid (default)
 * - 'white': White background with magenta/purple gradient orb and grid
 */
export const GridBackground = ({
  variant = "black",
  className,
  children,
}: GridBackgroundProps) => {
  const backgroundStyles =
    variant === "white"
      ? {
          background: "white",
          backgroundImage: `
            linear-gradient(to right, rgba(71,85,105,0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(71,85,105,0.15) 1px, transparent 1px),
            radial-gradient(circle at 50% 60%, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)
          `,
          backgroundSize: "40px 40px, 40px 40px, 100% 100%",
        }
      : {
          background: "#000000",
          backgroundImage: `
            linear-gradient(to right, rgba(75, 85, 99, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(75, 85, 99, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        };

  return (
    <div className={cn("min-h-screen w-full relative", className)}>
      {/* Grid Background */}
      <div className="absolute inset-0 z-0" style={backgroundStyles} />
      
      {/* Content */}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
};

