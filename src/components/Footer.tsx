import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left - Copyright */}
          <div className="flex items-center gap-3">
            <Image
              src="/icon.png"
              alt="Scrollio Logo"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-sm text-[#9090a0]">
              © {currentYear} Scrollio. All rights reserved.
            </span>
          </div>

          {/* Right - Tagline */}
          <p className="text-sm text-[#9090a0] text-center md:text-right">
            Built for families, kids and schools who believe learning can feel like play.
          </p>
        </div>
      </div>
    </footer>
  );
}

