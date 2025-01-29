interface SpinnerProps {
  size?: number;
}

export function Spinner({ size = 16 }: SpinnerProps) {
  return (
    <span
      className="spinner"
      style={{
        // @ts-expect-error - custom property
        "--spinner-size": `${size}px`,
      }}
    >
      <span className="spinner-leaf" />
      <span className="spinner-leaf" />
      <span className="spinner-leaf" />
      <span className="spinner-leaf" />
      <span className="spinner-leaf" />
      <span className="spinner-leaf" />
      <span className="spinner-leaf" />
      <span className="spinner-leaf" />
    </span>
  );
}
