import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="px-10 md:px-20 py-16">
        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Branding */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold text-white mb-2">🌍 REST Explorer</h3>
            <p className="text-sm text-slate-400">
              Explore the world with real-time country data. Free, Reliable, Open.
            </p>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm uppercase tracking-widest font-semibold text-white mb-4">
              Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-white transition">
                  Countries
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-white transition">
                  API Docs
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-white transition">
                  Changelog
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm uppercase tracking-widest font-semibold text-white mb-4">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-white transition">
                  Docs
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-white transition">
                  Issues
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-white transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm uppercase tracking-widest font-semibold text-white mb-4">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-white transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Stay Connected */}
          <div className="lg:col-span-1">
            <h4 className="text-sm uppercase tracking-widest font-semibold text-white mb-4">
              Stay Connected
            </h4>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition"
              >
                <FaGithub className="text-lg" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition"
              >
                <FaTwitter className="text-lg" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition"
              >
                <FaLinkedin className="text-lg" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="border-t border-white/10 pt-8">
          <p className="text-sm text-slate-400 text-center">
            © 2026 REST Explorer. Built with ❤️ and REST Countries API.
          </p>
        </div>
      </div>
    </footer>
  );
}
