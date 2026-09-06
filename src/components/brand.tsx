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
        src="/brand/trimurti-coolers-logo.svg"
        alt="Trimurti Coolers"
        width={560}
        height={160}
        priority
      />
    </Link>
  );
}
