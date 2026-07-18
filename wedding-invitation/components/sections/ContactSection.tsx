"use client";
// components/sections/ContactSection.tsx
import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";

interface ContactLink {
  icon: string;
  label: string;
  value: string;
  href: string;
  color: string;
}

const contacts: ContactLink[] = [
  {
    icon: "📞",
    label: "Phone",
    value: "+91 98765 43210",
    href: "tel:+919876543210",
    color: "#D4AF37",
  },
  {
    icon: "💬",
    label: "WhatsApp",
    value: "Message Us",
    href: "https://wa.me/919876543210",
    color: "#25D366",
  },
  {
    icon: "📸",
    label: "Instagram",
    value: "@aryan.weds.zara",
    href: "https://instagram.com",
    color: "#E1306C",
  },
  {
    icon: "📍",
    label: "Location",
    value: "New Delhi, India",
    href: "https://maps.google.com",
    color: "#D4AF37",
  },
];

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="section-padding"
      style={{ background: "var(--bg-main)" }}
    >
      <div className="container-luxury">
        <div className="mb-16">
          <SectionTitle
            eyebrow="Reach Out"
            title="Get in Touch"
            subtitle="Have questions? We'd love to hear from you. Reach out through any of the following channels."
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {contacts.map((contact, index) => (
            <motion.a
              key={index}
              href={contact.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-6 rounded-2xl text-center cursor-pointer"
              style={{
                background: "transparent",
                border: "1px solid rgba(212,175,55,0.15)",
                backdropFilter: "blur(10px)",
                textDecoration: "none",
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{
                y: -8,
                borderColor: "rgba(212,175,55,0.4)",
                boxShadow: "0 16px 40px rgba(212,175,55,0.15)",
              }}
              whileTap={{ scale: 0.97 }}
            >
              <motion.div
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                style={{ background: "linear-gradient(135deg, var(--bg-main), var(--beige))" }}
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                {contact.icon}
              </motion.div>

              <div>
                <p
                  className="font-body text-xs tracking-widest uppercase mb-1"
                  style={{ color: "var(--gold)" }}
                >
                  {contact.label}
                </p>
                <p className="font-body text-sm" style={{ color: "var(--text-main)", fontWeight: 400 }}>
                  {contact.value}
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}




