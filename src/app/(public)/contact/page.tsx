const whatsappNumber =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

const whatsappMessage =
  "Hi, I would like to ask about your photography services.";

const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  whatsappMessage
)}`;

export default function ContactPage() {
  return (
    <main className="min-h-[70vh] px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
            Contact
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-gray-900">
            Let&apos;s talk about your session
          </h1>

          <p className="mt-4 text-lg leading-8 text-gray-600">
            Have questions about packages, schedules, locations, or a
            custom photography session? Contact us directly through
            WhatsApp.
          </p>

          <div className="mt-8">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Contact via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}