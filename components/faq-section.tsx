/**
 * FAQ Section with Schema.org structured data for SEO
 */

"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionLabel } from "@/components/ui/section-label";
import { GradientText } from "@/components/ui/gradient-text";

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as any } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const faqs = [
  {
    question: "How do I rent a motorcycle from SJ Rental?",
    answer: "Simply browse our available motors, select your preferred bike, choose your rental dates, and complete the booking. You can pick up your motorcycle at our location or request delivery.",
  },
  {
    question: "What documents do I need to rent a motor?",
    answer: "You need a valid driver's license (SIM C), ID card (KTP), and a deposit. International customers need a valid passport and international driving permit.",
  },
  {
    question: "Is insurance included in the rental price?",
    answer: "Yes! All our rentals include comprehensive insurance coverage for your peace of mind during the rental period.",
  },
  {
    question: "What are the rental periods available?",
    answer: "We offer flexible rental periods: daily, weekly, and monthly options. The longer you rent, the better rates you get!",
  },
  {
    question: "Can I cancel or modify my booking?",
    answer: "Yes, you can cancel or modify your booking up to 24 hours before the rental start time. Check our terms and conditions for details.",
  },
  {
    question: "What happens if the motorcycle breaks down?",
    answer: "We provide 24/7 roadside assistance. Contact our support team immediately, and we'll arrange for repairs or a replacement motorcycle.",
  },
];

export function FAQSection() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="px-4 py-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container mx-auto max-w-4xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15, margin: "-60px" }} variants={stagger} className="mb-16 text-center">
          <motion.div variants={fadeInUp} className="mb-6 flex justify-center">
            <SectionLabel>FAQ</SectionLabel>
          </motion.div>

          <motion.h2 variants={fadeInUp} className="mb-4 font-serif text-3xl tracking-tight md:text-[3.25rem] md:leading-[1.15]">
            Frequently Asked <GradientText>Questions</GradientText>
          </motion.h2>

          <motion.p variants={fadeInUp} className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Everything you need to know about renting with SJ Rental
          </motion.p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15, margin: "-60px" }} variants={stagger} className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
