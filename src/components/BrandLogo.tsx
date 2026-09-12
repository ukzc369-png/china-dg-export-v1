type BrandLogoProps = {
  subtitle: string;
  light?: boolean;
};

export default function BrandLogo({ subtitle, light = false }: BrandLogoProps) {
  return <span className={`brand-logo${light ? " light" : ""}`}>
    <svg className="brand-logo-mark" viewBox="0 0 44 44" aria-hidden="true">
      <rect width="44" height="44" rx="11" fill="currentColor" />
      <path d="M31.5 13.5A13 13 0 1 0 32 30" fill="none" stroke="#55c7f5" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M25.5 29.8H33V22.3" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="14.2" cy="17" r="2.4" fill="#f5b942" />
    </svg>
    <span className="brand-logo-copy"><b>ChinaChemExport</b><small>{subtitle}</small></span>
  </span>;
}
