import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin stays outside locale prefix
  if (pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Prefer real public routes under /[locale]/hajj-YYYY (see app/[locale]/hajj-2027).
  // Only rewrite unknown future campaign years that still use the internal campaign path.
  const hajjRewrite = pathname.match(/^\/(de|ar|bs|en|tr)\/(hajj-\d{4})(\/.*)?$/);
  if (hajjRewrite) {
    const [, locale, slug, rest = ""] = hajjRewrite;
    // hajj-2027 has a dedicated App Router page — do not rewrite (avoids stale campaign cache).
    if (slug === "hajj-2027") {
      return intlMiddleware(request);
    }
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/hajj/campaign/${slug}${rest}`;
    return NextResponse.rewrite(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
