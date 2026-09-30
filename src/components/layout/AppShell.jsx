import React, { useState } from "react";
import { TridoshaLabLogo } from "../brand/TridoshaLabLogo";
import {
  LayoutDashboard,
  Users,
  Sparkles,
  ClipboardCheck,
  FileText,
  Sliders,
  User,
  Settings,
  Menu,
  X,
  Stethoscope,
  GraduationCap,
  BookOpen,
  Globe,
  LogOut,
  ChevronRight,
  ExternalLink,
  Layers,
  Award
} from "lucide-react";
import { Badge } from "../ui/Badge";
import { TRANSLATIONS } from "../../data/translations";

export function AppShell({
  children,
  activeRole,
  onRoleChange,
  activeLang,
  onLangChange,
  activeTab,
  onTabChange,
  currentUser,
  onOpenAuthModal,
  onOpenMethodology,
  pendingReviewCount = 0
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[activeLang] || TRANSLATIONS.en;

  // Define navigation items per role (Doctor and Student only)
  const getNavItems = () => {
    if (activeRole === "student") {
      return [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: LayoutDashboard
        },
        {
          id: "patients",
          label: "Patients Directory",
          icon: Users
        },
        {
          id: "assessment",
          label: "New Assessment",
          icon: Sparkles
        },
        {
          id: "reports",
          label: "Reports Archive",
          icon: FileText
        },
        {
          id: "profile",
          label: "Scholar Profile",
          icon: User
        },
        {
          id: "settings",
          label: "Settings",
          icon: Settings
        }
      ];
    }

    // Default: Doctor
    return [
      {
        id: "dashboard",
        label: "Clinical Dashboard",
        icon: LayoutDashboard
      },
      {
        id: "patients",
        label: "Patients Directory",
        icon: Users
      },
      {
        id: "assessment",
        label: "Assess Prakriti",
        icon: Sparkles
      },
      {
        id: "reviewQueue",
        label: "Review Queue",
        icon: ClipboardCheck,
        badge: pendingReviewCount > 0 ? pendingReviewCount : null
      },
      {
        id: "reports",
        label: "Reports Archive",
        icon: FileText
      },
      {
        id: "builder",
        label: "Questionnaire Builder",
        icon: Layers
      },
      {
        id: "profile",
        label: "Clinician Profile",
        icon: User
      },
      {
        id: "settings",
        label: "Settings",
        icon: Settings
      }
    ];
  };

  const navItems = getNavItems();

  const handleNavClick = (tabId) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FAF8F5] text-stone-800 antialiased font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* ======================================================== */}
      {/* DESKTOP SIDEBAR (lg and above)                            */}
      {/* ======================================================== */}
      <aside
        aria-label="Desktop Sidebar Navigation"
        className="no-print hidden lg:flex flex-col w-64 bg-gradient-to-b from-[#13382D] to-[#0E261E] text-white border-r border-emerald-900/60 shrink-0 sticky top-0 h-screen overflow-y-auto z-30"
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-emerald-800/60">
          <div
            onClick={() => onTabChange("landing")}
            className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-xl"
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onTabChange("landing");
              }
            }}
            title="TridoshaLab Public Overview"
          >
            <TridoshaLabLogo variant="horizontal" size="md" light={true} />
          </div>

          {/* Institutional Sub-attribution */}
          <div className="mt-3 pt-2.5 border-t border-emerald-800/40 flex items-center justify-between text-[10px] text-emerald-300/80">
            <span className="font-semibold text-amber-300">SDMCA Udupi • SMVITM</span>
            <span className="bg-emerald-950/80 px-1.5 py-0.5 rounded text-[9px] border border-emerald-700/60 font-mono">
              v2.5 Pro
            </span>
          </div>
        </div>

        {/* Role Switcher Pill */}
        <div className="px-4 py-3 border-b border-emerald-900/50 bg-[#0B1E17]/60">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1.5 flex items-center justify-between">
            <span>Clinical Workspace</span>
            <span className="text-[9px] text-stone-400 font-normal">Switch Role:</span>
          </div>

          <div className="grid grid-cols-2 gap-1 bg-[#122A22] p-1 rounded-xl border border-emerald-800/80 text-xs">
            <button
              type="button"
              onClick={() => onRoleChange("doctor")}
              className={`py-1.5 min-h-[36px] rounded-lg font-semibold flex items-center justify-center gap-1 transition-all text-[11px] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                activeRole === "doctor"
                  ? "bg-amber-500 text-stone-950 shadow-sm"
                  : "text-emerald-200 hover:text-white hover:bg-emerald-900/40"
              }`}
              title="Doctor (Vaidya) View"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Doctor</span>
            </button>

            <button
              type="button"
              onClick={() => onRoleChange("student")}
              className={`py-1.5 min-h-[36px] rounded-lg font-semibold flex items-center justify-center gap-1 transition-all text-[11px] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                activeRole === "student"
                  ? "bg-sky-500 text-white shadow-sm"
                  : "text-emerald-200 hover:text-white hover:bg-emerald-900/40"
              }`}
              title="Student Scholar View"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Scholar</span>
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav aria-label="Main Navigation" className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400/80">
            Platform Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? "page" : undefined}
                className={`w-full flex items-center justify-between px-3 py-2.5 min-h-[42px] rounded-xl text-xs font-semibold transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  isActive
                    ? "bg-emerald-700/80 text-white shadow-sm font-bold border border-emerald-600/60"
                    : "text-emerald-200 hover:text-white hover:bg-emerald-900/50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? "text-amber-300" : "text-emerald-300"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge !== null && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-stone-950">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Landing / Public link */}
          <div className="pt-3 border-t border-emerald-900/50 mt-3">
            <button
              type="button"
              onClick={() => onTabChange("landing")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                activeTab === "landing"
                  ? "bg-emerald-900 text-white font-bold"
                  : "text-emerald-300 hover:text-white hover:bg-emerald-900/40"
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>Platform Overview</span>
            </button>
          </div>
        </nav>

        {/* Bottom Utility Strip: Methodology + User Card */}
        <div className="p-3 border-t border-emerald-800/60 bg-[#0B1E17]/80 space-y-2">
          {/* Methodology Shloka Button */}
          <button
            type="button"
            onClick={onOpenMethodology}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl text-xs font-medium bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Samhita References</span>
          </button>

          {/* User Profile Card / Auth Button */}
          <button
            type="button"
            onClick={onOpenAuthModal}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-emerald-900/50 hover:bg-emerald-900/80 border border-emerald-800/80 transition-all text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            title="Switch Clinician / Sign In"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 font-bold text-xs flex items-center justify-center shrink-0">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "T"}
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-xs text-amber-100 truncate">
                  {currentUser?.name || "Clinician"}
                </div>
                <div className="text-[10px] text-emerald-300/80 capitalize truncate">
                  {currentUser?.role || activeRole}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0" />
          </button>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* MOBILE / TABLET TOP HEADER BAR (< lg)                    */}
      {/* ======================================================== */}
      <header
        aria-label="Mobile Header"
        className="no-print lg:hidden sticky top-0 z-40 bg-gradient-to-b from-[#13382D] to-[#0E261E] text-white border-b border-emerald-800/80 px-4 py-3 shadow-md flex items-center justify-between"
      >
        <div
          onClick={() => onTabChange("landing")}
          className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg"
          tabIndex={0}
          role="button"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onTabChange("landing");
            }
          }}
          title="TridoshaLab"
        >
          <TridoshaLabLogo variant="horizontal" size="sm" light={true} />
        </div>

        <div className="flex items-center gap-2">
          {/* Active Role Tag */}
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-stone-950 uppercase">
            {activeRole}
          </span>

          {/* User Avatar Button */}
          <button
            type="button"
            onClick={onOpenAuthModal}
            className="w-8 h-8 min-h-[32px] min-w-[32px] rounded-full bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            title="Sign In / Clinician Session"
          >
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "T"}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 min-h-[44px] min-w-[44px] rounded-xl bg-emerald-900/80 text-emerald-100 hover:text-white border border-emerald-700/60 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="no-print lg:hidden fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Drawer"
            className="w-72 bg-[#13382D] text-white h-full flex flex-col shadow-2xl p-4 overflow-y-auto animate-in slide-in-from-left duration-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-emerald-800/80">
              <TridoshaLabLogo variant="horizontal" size="sm" light={true} />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 min-h-[44px] min-w-[44px] rounded-lg text-emerald-300 hover:text-white flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Role Switcher */}
            <div className="my-3 space-y-1">
              <div className="text-[10px] uppercase font-bold text-emerald-300">
                Switch Role Mode:
              </div>
              <div className="grid grid-cols-2 gap-1 bg-[#0E261E] p-1 rounded-xl text-xs">
                <button
                  type="button"
                  onClick={() => {
                    onRoleChange("doctor");
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2 min-h-[40px] text-center rounded-lg font-semibold transition-all ${
                    activeRole === "doctor" ? "bg-amber-500 text-stone-950" : "text-emerald-200"
                  }`}
                >
                  Doctor
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onRoleChange("student");
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2 min-h-[40px] text-center rounded-lg font-semibold transition-all ${
                    activeRole === "student" ? "bg-sky-500 text-white" : "text-emerald-200"
                  }`}
                >
                  Scholar
                </button>
              </div>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex-1 space-y-1 pt-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-3 min-h-[44px] rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-emerald-700 text-white font-bold"
                        : "text-emerald-200 hover:bg-emerald-900/50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-stone-950">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => handleNavClick("landing")}
                className="w-full flex items-center gap-2.5 px-3 py-3 min-h-[44px] rounded-xl text-xs font-semibold text-emerald-200 hover:bg-emerald-900/50"
              >
                <ExternalLink className="w-4 h-4 text-amber-400" />
                <span>Platform Overview</span>
              </button>
            </nav>

            {/* Bottom Actions in Drawer */}
            <div className="pt-3 border-t border-emerald-800/80 space-y-2">
              <button
                type="button"
                onClick={() => {
                  onOpenMethodology();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 min-h-[44px] bg-emerald-950 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 text-emerald-200 border border-emerald-700/50"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Samhita References</span>
              </button>
            </div>
          </div>
          <div
            className="flex-1"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* MAIN PLATFORM WORKSPACE                                   */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Notification / Language Bar */}
        <div className="no-print bg-[#FAF8F5] border-b border-stone-200/80 px-4 sm:px-8 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-stone-500 text-[11px]">
            <span className="font-semibold text-emerald-900 uppercase tracking-wide">
              TridoshaLab • Academic Calibration
            </span>
            <span>•</span>
            <span>SDM College of Ayurveda, Udupi & SMVITM Bantakal</span>
          </div>

          {/* Trilingual Language Selector */}
          <div
            role="group"
            aria-label="Language selection"
            className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-xl border border-stone-200 text-xs"
          >
            <Globe className="w-3.5 h-3.5 text-stone-400 ml-1.5 mr-0.5" aria-hidden="true" />
            <button
              type="button"
              onClick={() => onLangChange("en")}
              aria-pressed={activeLang === "en"}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
                activeLang === "en"
                  ? "bg-white text-emerald-900 shadow-2xs font-bold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onLangChange("kn")}
              aria-pressed={activeLang === "kn"}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all font-kannada ${
                activeLang === "kn"
                  ? "bg-white text-emerald-900 shadow-2xs font-bold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
              title="ಕನ್ನಡ (Kannada)"
            >
              ಕನ್ನಡ
            </button>
            <button
              type="button"
              onClick={() => onLangChange("hi")}
              aria-pressed={activeLang === "hi"}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
                activeLang === "hi"
                  ? "bg-white text-emerald-900 shadow-2xs font-bold"
                  : "text-stone-600 hover:text-stone-900"
              }`}
              title="हिंदी (Hindi)"
            >
              हिंदी
            </button>
          </div>
        </div>

        {/* Workspace Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>

        {/* Clinical Disclaimer & Institutional Footer */}
        <footer className="no-print mt-auto border-t border-stone-200 bg-white py-6 px-4 sm:px-8 text-xs text-stone-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <p className="font-semibold text-stone-800">
                TridoshaLab Platform • In Collaboration with SDM College of Ayurveda, Udupi & SMVITM Bantakal
              </p>
              <p className="text-[11px] text-stone-500 mt-1 max-w-2xl leading-relaxed">
                Evidence-based non-diagnostic constitutional (Deha Prakriti) assessment platform. Calibrated to classical Charaka Samhita, Sushruta Samhita, and Ashtanga Hridaya.
              </p>
              <p className="text-[10px] text-stone-400 mt-1">
                © {new Date().getFullYear()} TridoshaLab (<a href="https://tridoshalab.com" className="text-emerald-700 hover:underline">tridoshalab.com</a>). All rights reserved.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 text-[11px] text-emerald-800 font-medium">
              <span>Charaka Samhita</span>
              <span className="hidden sm:inline">•</span>
              <span>Sushruta Samhita</span>
              <span className="hidden sm:inline">•</span>
              <span>Ashtanga Hridaya</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default AppShell;
