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

  // Public Hajj campaign URLs: /de/hajj-2027 → internal /de/hajj/campaign/hajj-2027
  const hajjRewrite = pathname.match(/^\/(de|ar|bs|en|tr)\/(hajj-\d{4})(\/.*)?$/);
  if (hajjRewrite) {
    const [, locale, slug, rest = ""] = hajjRewrite;
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/hajj/campaign/${slug}${rest}`;
    return NextResponse.rewrite(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
