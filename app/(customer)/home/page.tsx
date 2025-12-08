"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CustomerNavbar } from "@/components/customer-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, FeaturedCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionLabel } from "@/components/ui/section-label";
import { GradientText } from "@/components/ui/gradient-text";
import { HeroGraphic } from "@/components/ui/hero-graphic";
import { Bike, Clock, Shield, Star, ArrowRight, Zap, Heart, TrendingUp } from "lucide-react";

const easeOut = [0.16, 1, 0.3, 1] as const;

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease: easeOut } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <CustomerNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-28 md:py-44">
        <div className="container mx-auto max-w-6xl">
          <div className="grid items-center gap-12 md:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10">
              <motion.div variants={fadeIn} className="mb-6">
                <SectionLabel animated>Motor Rental</SectionLabel>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="mb-6 font-serif text-[2.75rem] leading-[1.05] tracking-tight md:text-6xl lg:text-[5.25rem]">
                Rent Your Perfect <GradientText underline>Motor</GradientText> Today
              </motion.h1>

              <motion.p variants={fadeInUp} className="mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                Experience freedom on two wheels. Quality motors, flexible rentals, and unbeatable service.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" asChild className="group w-full sm:w-auto">
                  <Link href="/motors" className="flex items-center">
                    Browse Motors
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                  <Link href="/booking">Book Now</Link>
                </Button>
              </motion.div>

              <motion.div variants={fadeIn} className="mt-12 flex flex-wrap items-center gap-6 border-t border-border pt-8">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-3xl font-semibold text-foreground">500+</span>
                    <TrendingUp className="h-4 w-4 text-accent" />
                  </div>
                  <p className="text-sm text-muted-foreground">Happy Customers</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div>
                  <div className="font-serif text-3xl font-semibold text-foreground">50+</div>
                  <p className="text-sm text-muted-foreground">Quality Motors</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-3xl font-semibold text-foreground">4.9</span>
                    <Star className="h-4 w-4 fill-accent text-accent" />
                  </div>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: easeOut }} className="hidden md:block">
              <HeroGraphic />
            </motion.div>
          </div>
        </div>

        {/* Radial glows */}
        <div className="pointer-events-none absolute left-0 top-0 h-[500px] w-[500px] bg-accent/5 blur-[150px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-[600px] w-[600px] bg-accent-secondary/5 blur-[150px]" />
      </section>

      {/* Features Section */}
      <section className="px-4 py-28">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15, margin: "-60px" }} variants={stagger} className="mb-16 text-center">
            <motion.div variants={fadeIn} className="mb-6 flex justify-center">
              <SectionLabel>Why Choose Us</SectionLabel>
            </motion.div>

            <motion.h2 variants={fadeInUp} className="mb-4 font-serif text-3xl tracking-tight md:text-[3.25rem] md:leading-[1.15]">
              We Make Motor Rental <GradientText>Easy</GradientText>
            </motion.h2>

            <motion.p variants={fadeInUp} className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Safe, affordable, and hassle-free rentals
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15, margin: "-60px" }} variants={stagger} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Bike,
                title: "Wide Selection",
                description: "Choose from our extensive fleet of well-maintained motors",
              },
              {
                icon: Clock,
                title: "Flexible Rental",
                description: "Daily, weekly, or monthly options to fit your schedule",
              },
              {
                icon: Shield,
                title: "Full Insurance",
                description: "Ride with peace of mind with comprehensive coverage",
              },
              {
                icon: Heart,
                title: "5-Star Service",
                description: "Rated excellent by thousands of satisfied customers",
              },
            ].map((feature, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card variant="elevated" className="group h-full hover:bg-linear-to-br hover:from-accent/3 hover:to-transparent">
                  <CardHeader>
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-linear-to-br from-accent to-accent-secondary shadow-accent transition-transform group-hover:scale-110">
                      <feature.icon className="h-7 w-7 text-accent-foreground" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="leading-relaxed">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Motors */}
      <section className="px-4 py-28">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15, margin: "-60px" }} variants={stagger} className="mb-16 text-center">
            <motion.div variants={fadeIn} className="mb-6 flex justify-center">
              <SectionLabel animated>Featured Fleet</SectionLabel>
            </motion.div>

            <motion.h2 variants={fadeInUp} className="mb-4 font-serif text-3xl tracking-tight md:text-[3.25rem] md:leading-[1.15]">
              Our Most <GradientText>Popular</GradientText> Rentals
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15, margin: "-60px" }} variants={stagger} className="mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Honda Beat", type: "Automatic", price: "50,000", rating: "4.8" },
              { name: "Yamaha Mio", type: "Automatic", price: "55,000", rating: "4.7" },
              { name: "Honda Vario 160", type: "Automatic", price: "65,000", rating: "4.9" },
            ].map((motor, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                {idx === 1 ? (
                  <FeaturedCard>
                    <Card variant="gradient" className="h-full border-0 shadow-none">
                      <div className="relative h-56 overflow-hidden rounded-t-2xl bg-muted">
                        <div className="flex h-full items-center justify-center bg-linear-to-br from-accent/5 to-accent-secondary/5">
                          <Bike className="h-24 w-24 text-accent/30" />
                        </div>
                        <Badge className="absolute right-4 top-4 bg-accent text-accent-foreground">Featured</Badge>
                      </div>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="mb-2 text-2xl">{motor.name}</CardTitle>
                            <CardDescription className="flex items-center gap-2">
                              {motor.type}
                              <span className="text-accent">•</span>
                              <span className="flex items-center gap-1">
                                <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                                {motor.rating}
                              </span>
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="font-serif text-3xl font-semibold text-foreground">Rp {motor.price}</p>
                            <p className="text-sm text-muted-foreground">per day</p>
                          </div>
                          <Button asChild className="group">
                            <Link href="/booking">
                              Rent
                              <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </FeaturedCard>
                ) : (
                  <Card variant="elevated" className="group h-full overflow-hidden">
                    <div className="relative h-56 overflow-hidden bg-muted">
                      <div className="flex h-full items-center justify-center bg-linear-to-br from-muted to-muted/50">
                        <Bike className="h-24 w-24 text-muted-foreground/30" />
                      </div>
                      {motor.rating === "4.9" && (
                        <Badge className="absolute right-4 top-4 border-accent/30 bg-accent/5 text-accent">
                          <Zap className="mr-1 h-3 w-3" />
                          Hot
                        </Badge>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl">{motor.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        {motor.type}
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                          {motor.rating}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="font-serif text-2xl font-semibold text-foreground">Rp {motor.price}</p>
                          <p className="text-sm text-muted-foreground">per day</p>
                        </div>
                        <Button size="sm" variant="outline" asChild className="group">
                          <Link href="/booking">
                            Rent
                            <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15, margin: "-60px" }} variants={fadeIn} className="text-center">
            <Button size="lg" variant="outline" asChild className="group">
              <Link href="/motors" className="flex items-center">
                View All Motors
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Inverted */}
      <section className="dot-pattern relative overflow-hidden bg-foreground px-4 py-32 text-background md:py-44">
        <div className="container relative z-10 mx-auto max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger} className="text-center">
            <motion.div variants={fadeIn} className="mb-8 flex justify-center">
              <SectionLabel className="border-accent/50 bg-accent/10">Get Started</SectionLabel>
            </motion.div>

            <motion.h2 variants={fadeInUp} className="mb-6 font-serif text-4xl tracking-tight md:text-5xl md:leading-tight">
              Ready to Start Your <GradientText>Journey?</GradientText>
            </motion.h2>

            <motion.p variants={fadeInUp} className="mb-10 text-xl text-background/80 md:text-2xl">
              Book your motor in just a few clicks
            </motion.p>

            <motion.div variants={fadeInUp}>
              <Button size="lg" asChild className="group shadow-accent-lg">
                <Link href="/booking">
                  Book Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="pointer-events-none absolute left-0 top-0 h-[400px] w-[400px] bg-accent/8 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] bg-accent-secondary/8 blur-[150px]" />
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-4">
            <div>
              <h3 className="mb-4 font-serif text-2xl font-semibold text-foreground">
                SJ<span className="gradient-text">Rent</span>
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">Your trusted motor rental partner in Indonesia</p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-foreground">Quick Links</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="transition-colors hover:text-accent">
                  <Link href="/motors">Available Motors</Link>
                </li>
                <li className="transition-colors hover:text-accent">
                  <Link href="/booking">Book Now</Link>
                </li>
                <li className="transition-colors hover:text-accent">
                  <Link href="/my-bookings">My Bookings</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-foreground">Support</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="transition-colors hover:text-accent">Contact Us</li>
                <li className="transition-colors hover:text-accent">FAQs</li>
                <li className="transition-colors hover:text-accent">Terms & Conditions</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-foreground">Contact</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>Phone: +62 123 4567 890</li>
                <li>Email: info@sjrent.com</li>
                <li>Address: Jakarta, Indonesia</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">© 2025 SJRent. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
