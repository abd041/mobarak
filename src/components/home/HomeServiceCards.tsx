import Image from "next/image";
import { Libre_Baskerville } from "next/font/google";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { DirArrow } from "@/components/ui/DirArrow";

const sectionDisplay = Libre_Baskerville({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  display: "swap",
});

const CATEGORIES = [
  {
    key: "umrah",
    href: "/umrah-gruppenreisen",
    icon: "/brand/icons/home/people.png",
    photo: "/brand/home-categories/umrah-photo-v3.png",
    titleLinesKey: "serviceUmrahTitleLines" as const,
    subtitleKey: "categoryUmrahSubtitle" as const,
  },
  {
    key: "individual",
    href: "/individuelle-umrah",
    icon: "/brand/icons/home/plane.png",
    photo: "/brand/home-categories/individual-photo-v3.png",
    titleLinesKey: "serviceIndividualTitleLines" as const,
    subtitleKey: "categoryIndividualSubtitle" as const,
  },
  {
    key: "hajj",
    href: "/hajj-2027",
    icon: "/brand/icons/home/kaaba.png",
    photo: "/brand/home-categories/hajj-photo-v3.png",
    titleLinesKey: "serviceHajjTitleLines" as const,
    subtitleKey: "categoryHajjSubtitle" as const,
  },
  {
    key: "visa",
    href: "/visum-service",
    icon: "/brand/icons/home/document.png",
    photo: "/brand/home-categories/visa-photo-v3.png",
    titleLinesKey: "serviceVisaTitleLines" as const,
    subtitleKey: "categoryVisaSubtitle" as const,
  },
] as const;

export async function HomeServiceCards() {
  const t = await getTranslations("home");

  return (
    <section
      className="bg-white py-10 sm:py-12 md:py-14"
      aria-labelledby="home-categories-heading"
    >
      <Container className="lg:px-9">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="mb-2 flex items-center gap-2 text-[12px] font-bold tracking-[0.04em] text-[#F28C18] sm:text-[13px]">
              <span className="inline-block h-[2px] w-4 rounded-full bg-[#F28C18]" aria-hidden />
              {t("categoriesEyebrow")}
            </p>
            <h2
              id="home-categories-heading"
              className={`${sectionDisplay.className} text-[1.55rem] font-bold leading-tight tracking-[-0.02em] text-[#0B2A7A] sm:text-[1.85rem] md:text-[2.05rem]`}
            >
              {t("categoriesTitle")}
            </h2>
            <p className="mt-1.5 text-[14px] text-[#0B2A7A]/80 sm:text-[15px]">
              {t("categoriesSubtitle")}
            </p>
          </div>
          <Link
            href="/umrah-gruppenreisen"
            className="inline-flex shrink-0 items-center gap-1.5 text-[14px] font-bold text-[#1264F5] transition hover:text-[#0F56D6]"
          >
            {t("categoriesViewAll")}
            <DirArrow className="text-base" />
          </Link>
        </div>

        <ul className="home-category-card-grid grid grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((card) => {
            const titleLines = t.raw(card.titleLinesKey) as string[];

            return (
              <li key={card.key} className="min-w-0">
                <Link
                  href={card.href}
                  className={`home-category-card home-category-card--${card.key} group relative block overflow-hidden border border-[#E6E9EF] bg-white shadow-[0_8px_24px_rgba(11,44,74,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(11,44,74,0.11)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1264F5]`}
                >
                  <span className="home-category-card-photo-clip pointer-events-none select-none" aria-hidden>
                    <Image
                      src={card.photo}
                      alt=""
                      fill
                      sizes="(max-width: 767px) 50vw, (max-width: 1024px) 50vw, 25vw"
                      className="home-category-card-cover pointer-events-none select-none"
                      quality={100}
                    />
                  </span>

                  <span className="home-category-card-diagonal pointer-events-none select-none" aria-hidden />

                  <div className="home-category-card-body">
                    <div className="home-category-card-icon">
                      <Image
                        src={card.icon}
                        alt=""
                        width={56}
                        height={56}
                        sizes="(max-width: 767px) 44px, 52px"
                        className="h-full w-full object-contain object-center"
                      />
                    </div>

                    <div className="home-category-card-copy">
                      <h3 className={`${sectionDisplay.className} home-category-card-title`}>
                        {titleLines.map((line, i) => (
                          <span key={`${card.key}-t-${i}`} className="block">
                            {line}
                          </span>
                        ))}
                      </h3>
                      <p className="home-category-card-subtitle">{t(card.subtitleKey)}</p>
                    </div>
                  </div>

                  <span className="home-category-card-arrow" aria-hidden>
                    <Image
                      src="/brand/icons/home/category-arrow.png"
                      alt=""
                      width={32}
                      height={18}
                      className="home-category-card-arrow-icon rtl:rotate-180"
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
