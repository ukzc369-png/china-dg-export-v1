type BrandLogoProps = {
  subtitle: string;
  light?: boolean;
};

export default function BrandLogo({ subtitle, light = false }: BrandLogoProps) {
  return <span className={`brand-logo${light ? " light" : ""}`}>
    <svg className="brand-logo-mark" viewBox="0 0 44 44" aria-hidden="true">
      <rect width="44" height="44" fill="#062b52" />
      <text x="3" y="31" fill="#fff" fontFamily="Arial, sans-serif" fontSize="19" fontWeight="800" letterSpacing="-2">CCE</text>
      <rect x="33" y="21" width="7" height="7" fill="#1678d4" />
    </svg>
    <span className="brand-logo-copy"><b>ChinaChemExport</b><small>{subtitle}</small></span>
  </span>;
}
