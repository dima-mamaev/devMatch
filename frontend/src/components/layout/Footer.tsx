import Link from "next/link";
import { ZapIcon } from "@/components/icons";

const footerLinks = [
  { href: "/legal", label: "Privacy" },
  { href: "/legal", label: "Terms" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-200 py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <ZapIcon />
          </div>
          <span className="font-semibold text-gray-900">DevMatch</span>
        </Link>
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} DevMatch. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          {footerLinks.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
