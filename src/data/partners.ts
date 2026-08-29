export type Partner = {
  id: string;
  title: string;
  /** Public path or absolute URL for the logo image */
  logoSrc: string;
  /** Optional outbound link */
  link?: string;
  sortOrder: number;
  /** Only visible partners appear on the homepage */
  visible: boolean;
};

/**
 * Default catalog — all hidden until Mobarak confirms permission to display.
 * Do not invent accreditations; enable in admin only when authorised.
 */
export const DEFAULT_PARTNERS: Partner[] = [
  {
    id: "iata",
    title: "IATA",
    logoSrc: "/brand/partners/iata.png",
    link: "",
    sortOrder: 10,
    visible: false,
  },
  {
    id: "saudia",
    title: "Saudia",
    logoSrc: "/brand/partners/saudia.png",
    link: "",
    sortOrder: 20,
    visible: false,
  },
  {
    id: "certified",
    title: "Certified",
    logoSrc: "/brand/partners/check.png",
    link: "",
    sortOrder: 30,
    visible: false,
  },
  {
    id: "halal",
    title: "Halal",
    logoSrc: "/brand/partners/halal.png",
    link: "",
    sortOrder: 40,
    visible: false,
  },
  {
    id: "xerotours",
    title: "Xerotours",
    logoSrc: "/brand/partners/xerotours.png",
    link: "",
    sortOrder: 50,
    visible: false,
  },
  {
    id: "obsv",
    title: "ÖBSV",
    logoSrc: "/brand/partners/obsv.png",
    link: "",
    sortOrder: 60,
    visible: false,
  },
];
