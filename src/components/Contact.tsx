import { useState } from "react";

interface ContactProps {
  hideHeader?: boolean;
}

export const Contact = ({ hideHeader = false }: ContactProps) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    reason: "General question",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your message! We will get back to you soon.");
    setFormData({
      name: "",
      phone: "",
      email: "",
      reason: "General question",
      message: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className="mx-auto max-w-[1100px]">
      {!hideHeader ? null : (
        <div className="px-5 pb-2 pt-10 md:px-8 md:pb-2 md:pt-[60px]">
          <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-hover">
            Get in touch
          </div>
          <h1 className="mb-2 font-serif text-[30px] font-semibold text-foreground md:text-[32px]">
            Contact us
          </h1>
          <p className="max-w-[480px] text-[14px] leading-[1.6] text-muted-foreground">
            Questions, catering requests, or feedback — we&apos;d love to hear from you.
          </p>
        </div>
      )}

      <div className="mx-5 mt-6 overflow-hidden rounded-2xl border border-border md:mx-8 md:mt-10 md:grid md:grid-cols-[1.1fr_0.9fr]">
        <div className="px-6 py-8 md:px-10 md:py-11">
          <h2 className="mb-5 font-serif text-[20px] font-semibold text-foreground">
            Send a message
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[12px] uppercase tracking-[0.04em] text-muted-foreground">
                  Name
                </label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  className="w-full rounded-md border border-border bg-white px-3 py-[11px] text-[13.5px] text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] uppercase tracking-[0.04em] text-muted-foreground">
                  Phone
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(optional)"
                  className="w-full rounded-md border border-border bg-white px-3 py-[11px] text-[13.5px] text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="mb-1.5 block text-[12px] uppercase tracking-[0.04em] text-muted-foreground">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@email.com"
                required
                className="w-full rounded-md border border-border bg-white px-3 py-[11px] text-[13.5px] text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="mb-1.5 block text-[12px] uppercase tracking-[0.04em] text-muted-foreground">
                Reason for contact
              </label>
              <select
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="w-full rounded-md border border-border bg-white px-3 py-[11px] text-[13.5px] text-foreground focus:border-accent focus:outline-none"
              >
                <option>General question</option>
                <option>Catering / large order</option>
                <option>Feedback</option>
                <option>Careers</option>
                <option>Other</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="mb-1.5 block text-[12px] uppercase tracking-[0.04em] text-muted-foreground">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we help?"
                required
                rows={4}
                className="min-h-[100px] w-full resize-y rounded-md border border-border bg-white px-3 py-[11px] text-[13.5px] text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="rounded bg-accent px-[22px] py-3 text-[13.5px] font-semibold text-white transition-colors hover:bg-accent-hover active:bg-accent-active"
            >
              Send message
            </button>
          </form>
        </div>

        <div className="flex flex-col justify-between bg-foreground px-6 py-8 text-background md:px-10 md:py-11">
          <div>
            <h2 className="mb-6 font-serif text-[20px] font-semibold">
              Reach us directly
            </h2>

            <div className="py-3.5">
              <div className="mb-1 text-[11.5px] uppercase tracking-[0.04em] text-background/60">
                Phone
              </div>
              <div className="text-[14px]">
                <a href="tel:+1000000000" className="text-background no-underline">
                  (placeholder — add shop number)
                </a>
              </div>
            </div>

            <div className="border-t border-white/15 py-3.5">
              <div className="mb-1 text-[11.5px] uppercase tracking-[0.04em] text-background/60">
                Email
              </div>
              <div className="text-[14px]">
                <a href="mailto:hello@totea.com" className="text-background no-underline">
                  hello@totea.com (placeholder)
                </a>
              </div>
            </div>

            <div className="border-t border-white/15 py-3.5">
              <div className="mb-1 text-[11.5px] uppercase tracking-[0.04em] text-background/60">
                Address
              </div>
              <div className="text-[14px]">
                9534 Liberia Ave
                <br />
                Manassas, VA 20110
              </div>
            </div>

            <div className="border-t border-white/15 py-3.5">
              <div className="mb-1 text-[11.5px] uppercase tracking-[0.04em] text-background/60">
                Hours
              </div>
              <div className="text-[14px]">
                Mon–Thu 11–9 · Fri–Sat 11–10 · Sun 12–8
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
