import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact us directly for photography package, schedule, and session inquiries.",
};

const whatsappNumber =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

const whatsappMessage =
  "Hi, I would like to ask about your photography services.";

const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  whatsappMessage
)}`;

export default function ContactPage() {
  return (
    <main className="bg-[#f6f3ee]">
      <section className="mx-auto grid min-h-180 max-w-7xl gap-16 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-28">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#8b7866]">
            Contact
          </p>

          <h1 className="mt-6 max-w-lg font-serif text-5xl leading-[0.95] tracking-[-0.03em] text-[#171717] md:text-6xl">
            Have a story in mind?
          </h1>

          <p className="mt-6 max-w-md text-[15px] leading-7 text-[#6d6963]">
            Tell me what you&apos;re planning. We can talk about the session,
            location, timing, and the kind of photographs you want to create.
          </p>
        </div>

        <div className="flex flex-col justify-between border-t border-[#d8d2ca] pt-8 lg:border-l lg:border-t-0 lg:pl-14 lg:pt-0">
          <div className="space-y-8">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#8b7866]">
                Based in
              </p>

              <p className="mt-2 font-serif text-3xl text-[#171717]">
                Makassar, Indonesia
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#8b7866]">
                Availability
              </p>

              <p className="mt-2 max-w-sm text-sm leading-6 text-[#6d6963]">
                Available for graduation, weddings, couples, family sessions,
                and selected events.
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#8b7866]">
                Direct contact
              </p>

              <p className="mt-2 text-sm text-[#6d6963]">
                WhatsApp is the fastest way to reach me.
              </p>
            </div>
          </div>

          <div className="mt-14 lg:mt-0">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border-b border-[#171717] pb-1 text-sm font-medium text-[#171717]"
            >
              Contact via WhatsApp ↗
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}