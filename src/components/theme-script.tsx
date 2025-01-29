const THEME_SCRIPT = `function r(){let e=localStorage.getItem("theme");return e&&"system"!==e?e:window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.classList.add(r());`;

export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: THEME_SCRIPT,
      }}
    />
  );
}

/* Source:
function resolveTheme() {
  const theme = localStorage.getItem('theme');
  if (!theme || theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
}
document.documentElement.classList.add(resolveTheme());
*/
