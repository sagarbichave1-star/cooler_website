import Link from "next/link";
import { Waves } from "lucide-react";

type BrandProps = {
  onClick?: () => void;
};

export function Brand({ onClick }: BrandProps) {
  return (
    <Link className="brand" href="/" aria-label="Tirupati Coolers home" onClick={onClick}>
      <span className="brand-mark" aria-hidden="true">
        <Waves size={20} strokeWidth={1.8} />
      </span>
      <span className="brand-name">
        Tirupati <strong>Coolers</strong>
      </span>
    </Link>
  );
}
