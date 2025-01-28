export default function ChevronRight() {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 16 16"
    >
      <path
        d="M12 8H4"
        className="origin-center scale-x-0 transition-transform group-hover:scale-x-100"
      />
      <path
        d="m6.5 11.5 3.146-3.146a.5.5 0 0 0 0-.708L6.5 4.5"
        className="transition-transform group-hover:translate-x-[2px]"
      />
    </svg>
  );
}
