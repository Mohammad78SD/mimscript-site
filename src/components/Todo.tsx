export function Todo({ children = "TODO" }: { children?: React.ReactNode }) {
  return <span className="todo">{children}</span>;
}
