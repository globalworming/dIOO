interface HintProps {
  children: React.ReactNode;
  /** Position variant */
  position?: "center" | "top";
}

export const Hint = ({ children, position = "top" }: HintProps) => {
  const positionClasses = position === "center"
    ? "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    : "absolute -top-6 left-1/2 -translate-x-1/2";

  return (
    <div className={`${positionClasses} bg-black/30 backdrop-blur-sm rounded-sm p-1 whitespace-nowrap flex items-center justify-center`}>
      <span className="text-white animate-pulse">
        {children}
      </span>
    </div>
  );
};
