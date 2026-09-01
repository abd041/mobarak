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
 * Homepage trust strip — logo1–6 retina (4×) sharpened exports.
 */
export const DEFAULT_PARTNERS: Partner[] = [
  {
    id: "iata",
    title: "IATA",
    logoSrc: "/brand/partners/iata-hd.png",
    link: "",
    sortOrder: 10,
    visible: true,
  },
  {
    id: "saudia",
    title: "Saudia",
    logoSrc: "/brand/partners/saudia-hd.png",
    link: "",
    sortOrder: 20,
    visible: true,
  },
  {
    id: "tuv",
    title: "TÜV",
    logoSrc: "/brand/partners/tuv-hd.png",
    link: "",
    sortOrder: 30,
    visible: true,
  },
  {
    id: "ministry-hajj",
    title: "Ministry of Hajj and Umrah",
    logoSrc: "/brand/partners/ministry-hajj-hd.png",
    link: "",
    sortOrder: 40,
    visible: true,
  },
  {
    id: "iso-9001",
    title: "ISO 9001:2015",
    logoSrc: "/brand/partners/iso-9001-hd.png",
    link: "",
    sortOrder: 50,
    visible: true,
  },
  {
    id: "ogsv",
    title: "ÖGSV",
    logoSrc: "/brand/partners/ogsv-hd.png",
    link: "",
    sortOrder: 60,
    visible: true,
  },
];
