import Link from "next/link";
import Image from "next/image";

type BrandProps = {
  onClick?: () => void;
};

export function Brand({ onClick }: BrandProps) {
  return (
    <Link className="brand" href="/" aria-label="Trimurti Coolers home" onClick={onClick}>
      <Image
        className="brand-logo"
        src="/brand/trimurti-coolers-logo-generated.png"
        alt="Trimurti Coolers"
        width={1000}
        height={366}
        sizes="(max-width: 640px) 160px, 230px"
        priority
      />
    </Link>
  );
}
