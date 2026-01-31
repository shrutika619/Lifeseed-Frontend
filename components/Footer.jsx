import Link from "next/link";
import {
  FacebookIcon,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#111827] text-gray-300 py-10 px-6">
      <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-4">
        {/* Brand / Mission */}
        <div>
          <h3 className="text-lg font-bold text-blue-500">MEN10</h3>
          <p className="mt-3 text-sm leading-6">
            Our mission is to provide accessible,
            confidential, and holistic sexual wellness
            solutions for men, blending ancient Ayurvedic
            wisdom with modern science.
          </p>
          <div className="flex space-x-4 mt-4">
            <a href="#" aria-label="Facebook">
              <FacebookIcon className="w-5 h-5 hover:text-white" />
            </a>
            <a href="#" aria-label="Instagram">
              <Instagram className="w-5 h-5 hover:text-white" />
            </a>
            <a href="#" aria-label="Twitter">
              <Twitter className="w-5 h-5 hover:text-white" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/clinics">Our Clinics</Link></li>
            <li><Link href="/conditions">Conditions We Treat</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-semibold mb-3">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/faqs">FAQs</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
            <li><Link href="/refund-policy">Refund Policy</Link></li>
            <li><Link href="/partnershipprogram">Partnership Program</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-semibold mb-3">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start">
              <MapPin className="w-4 h-4 mr-2 mt-1 text-red-400" />
              Plot No 18, Geeta nagar, Nagpur 440034, Maharashtra, India
            </li>
            <li className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-gray-400" />
              support@men10.com
            </li>
            <li className="flex items-center">
              <Phone className="w-4 h-4 mr-2 text-gray-400" />
              +91 7800-102-108
            </li>
          </ul>
        </div>
      </div>

      {/* Divider + Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-10 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between text-sm text-gray-400">
        <p>
          © 2026  <span className="font-semibold">MEN10</span>. All rights reserved.
        </p>
        <div className="space-x-6 mt-3 md:mt-0">
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
