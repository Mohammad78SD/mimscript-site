import Image from "next/image";
import type { Project } from "@/data/projects";

/**
 * Preview image of a project. Uses the temporary social-card image when there
 * is one, otherwise a generated placeholder (name on dark green).
 * TODO: replace all of these with real screenshots.
 */
export function ProjectCover({
  project,
  sizes = "(min-width: 768px) 50vw, 100vw",
  priority = false,
}: {
  project: Project;
  sizes?: string;
  priority?: boolean;
}) {
  if (project.image) {
    return (
      <Image
        src={project.image}
        alt={`${project.title} preview`}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={`${project.title} preview (placeholder)`}
      className="absolute inset-0 flex items-end justify-between bg-green-deep p-5 text-mint"
      style={{
        backgroundImage:
          "linear-gradient(rgba(168,213,200,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(168,213,200,.08) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    >
      <span className="text-2xl font-bold tracking-tight sm:text-4xl">
        {project.title}
      </span>
      <span className="label opacity-70">preview — TODO</span>
    </div>
  );
}
