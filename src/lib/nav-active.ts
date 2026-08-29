/** Returns true when the Umrah Gruppenreise nav item should be active. */
export function isUmrahGroupNavActive(pathname: string): boolean {
  return (
    pathname === "/umrah-gruppenreisen" ||
    pathname.startsWith("/umrah-gruppenreisen/") ||
    pathname.startsWith("/umrah/gruppenreise")
  );
}

/** Returns true when a top-level nav href matches the current path. */
export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/umrah-gruppenreisen") {
    return isUmrahGroupNavActive(pathname);
  }
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
