import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { BsInstagram, BsTwitter } from "react-icons/bs";
import { LiaLinkedin } from "react-icons/lia";

const Footer = () => {
      return (
            <footer className="mt-16 border-t bg-background container mx-auto px-4">
                  <div className="container mx-auto px-4">
                        <div className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
                              {/* Brand */}
                              <div>
                                    <Link href="/" className="inline-block">
                                          <div className="flex items-center">
                                                <Image
                                                      src="/logo.png"
                                                      alt="BloodBridge Logo"
                                                      width={180}
                                                      height={50}
                                                      className="h-12 w-auto"
                                                />
                                                <h1 className="text-xl font-bold"><span className="text-red-700">Blood</span>Bridge</h1>
                                          </div>
                                    </Link>

                                    <p className="mt-4 text-sm text-muted-foreground">
                                          BloodBridge connects voluntary blood donors with patients in need,
                                          making blood donation faster, safer, and accessible across
                                          Bangladesh.
                                    </p>

                                    <div className="mt-5 flex items-center gap-3">
                                          <Link
                                                href="#"
                                                className="rounded-full border p-2 transition hover:bg-muted"
                                          >
                                                <FaFacebook className="h-4 w-4" />
                                          </Link>

                                          <Link
                                                href="#"
                                                className="rounded-full border p-2 transition hover:bg-muted"
                                          >
                                                <BsInstagram className="h-4 w-4" />
                                          </Link>

                                          <Link
                                                href="#"
                                                className="rounded-full border p-2 transition hover:bg-muted"
                                          >
                                                <BsTwitter className="h-4 w-4" />
                                          </Link>

                                          <Link
                                                href="#"
                                                className="rounded-full border p-2 transition hover:bg-muted"
                                          >
                                                <LiaLinkedin className="h-4 w-4" />
                                          </Link>
                                    </div>
                              </div>

                              {/* Quick Links */}
                              <div>
                                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                                          Quick Links
                                    </h3>

                                    <ul className="space-y-3 text-sm text-muted-foreground">
                                          <li>
                                                <Link href="/" className="hover:text-foreground">
                                                      Home
                                                </Link>
                                          </li>

                                          <li>
                                                <Link href="/donors" className="hover:text-foreground">
                                                      Find Donors
                                                </Link>
                                          </li>

                                          <li>
                                                <Link href="/register" className="hover:text-foreground">
                                                      Become a Donor
                                                </Link>
                                          </li>

                                          <li>
                                                <Link href="/about" className="hover:text-foreground">
                                                      About Us
                                                </Link>
                                          </li>
                                    </ul>
                              </div>

                              {/* Resources */}
                              <div>
                                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                                          Resources
                                    </h3>

                                    <ul className="space-y-3 text-sm text-muted-foreground">
                                          <li>
                                                <Link href="/eligibility" className="hover:text-foreground">
                                                      Donation Eligibility
                                                </Link>
                                          </li>

                                          <li>
                                                <Link href="/faq" className="hover:text-foreground">
                                                      FAQs
                                                </Link>
                                          </li>

                                          <li>
                                                <Link
                                                      href="/privacy-policy"
                                                      className="hover:text-foreground"
                                                >
                                                      Privacy Policy
                                                </Link>
                                          </li>

                                          <li>
                                                <Link href="/terms" className="hover:text-foreground">
                                                      Terms & Conditions
                                                </Link>
                                          </li>
                                    </ul>
                              </div>

                              {/* Contact */}
                              <div>
                                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                                          Contact
                                    </h3>

                                    <div className="space-y-4 text-sm text-muted-foreground">
                                          <div className="flex gap-3">
                                                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                                <span>Rajshahi, Bangladesh</span>
                                          </div>

                                          <div className="flex gap-3">
                                                <Phone className="h-4 w-4 shrink-0" />
                                                <span>+880 17760-40031</span>
                                          </div>

                                          <div className="flex gap-3">
                                                <Mail className="h-4 w-4 shrink-0" />
                                                <span>support@bloodbridge.com</span>
                                          </div>
                                    </div>
                              </div>
                        </div>

                        <div className="flex flex-col items-center justify-between gap-3 border-t py-6 text-center text-sm text-muted-foreground md:flex-row">
                              <p>
                                    © {new Date().getFullYear()} BloodBridge. All rights reserved.
                              </p>

                              <div className="flex items-center gap-4">
                                    <Link href="/privacy-policy" className="hover:text-foreground">
                                          Privacy
                                    </Link>

                                    <Link href="/terms" className="hover:text-foreground">
                                          Terms
                                    </Link>

                                    <Link href="/contact" className="hover:text-foreground">
                                          Contact
                                    </Link>
                              </div>
                        </div>
                  </div>
            </footer>
      );
};

export default Footer;