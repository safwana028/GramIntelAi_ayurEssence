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
  HeartHandshake,
  BookOpen,
  Globe,
  LogOut,
  ChevronRight,
  ExternalLink,
  Layers,
  Award,
  Bell
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
  onSignOut,
  pendingReviewCount = 0
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[activeLang] || TRANSLATIONS.en;

  // Define navigation items per role (Doctor, Student, Patient)
  const getNavItems = () => {
    if (activeRole === "patient") {
      return [
        {
          id: "dashboard",
          label: t.navDashboard || "My Dashboard",
          icon: LayoutDashboard
        },
        {
          id: "assessment",
          label: t.startSelfAssessment || "Self-Assessment",
          icon: Sparkles
        },
        {
          id: "reports",
          label: t.navReports || "My Reports",
          icon: FileText
        },
        {
          id: "settings",
          label: t.navSettings || "Settings",
          icon: Settings
        }
      ];
    }

    if (activeRole === "student") {
      return [
        {
          id: "dashboard",
          label: t.navDashboard || "Dashboard",
          icon: LayoutDashboard
        },
        {
          id: "patients",
          label: t.navPatients || "Patients Directory",
          icon: Users
        },
        {
          id: "assessment",
          label: t.navNewAssessment || "New Assessment",
          icon: Sparkles
        },
        {
          id: "reports",
          label: t.navReports || "Reports Archive",
          icon: FileText
        },
        {
          id: "profile",
          label: t.navProfile || "Scholar Profile",
          icon: User
        },
        {
          id: "settings",
          label: t.navSettings || "Settings",
          icon: Settings
        }
      ];
    }

    // Default: Doctor
    return [
      {
        id: "dashboard",
        label: t.navDashboard || "Clinical Dashboard",
        icon: LayoutDashboard
      },
      {
        id: "patients",
        label: t.navPatients || "Patients Directory",
        icon: Users
      },
      {
        id: "assessment",
        label: t.navNewAssessment || "Assess Prakriti",
        icon: Sparkles
      },
      {
        id: "reviewQueue",
        label: t.navReviewQueue || "Review Queue",
        icon: ClipboardCheck,
        badge: pendingReviewCount > 0 ? pendingReviewCount : null
      },
      {
        id: "reports",
        label: t.navReports || "Reports Archive",
        icon: FileText
      },
      {
        id: "builder",
        label: t.navQuestionnaireBuilder || "Questionnaire Builder",
        icon: Layers
      },
      {
        id: "profile",
        label: t.navProfile || "Clinician Profile",
        icon: User
      },
      {
        id: "settings",
        label: t.navSettings || "Settings",
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

        {/* Active Domain Workspace Badge (Strict Isolation: No switching to other 2 roles) */}
        <div className="px-4 py-3 border-b border-emerald-900/50 bg-[#0B1E17]/60">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1.5 flex items-center justify-between">
            <span>{t.activeWorkspace || "Active Workspace"}</span>
            <span className="text-[9px] text-amber-400/90 font-mono font-medium">{t.loggedAs || "Logged in"}</span>
          </div>

          <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
            activeRole === "doctor"
              ? "bg-amber-950/40 border-amber-600/50 text-amber-200"
              : activeRole === "student"
              ? "bg-sky-950/40 border-sky-600/50 text-sky-200"
              : "bg-emerald-950/40 border-emerald-600/50 text-emerald-200"
          }`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              activeRole === "doctor"
                ? "bg-amber-500 text-stone-950"
                : activeRole === "student"
                ? "bg-sky-500 text-white"
                : "bg-emerald-500 text-stone-950"
            }`}>
              {activeRole === "doctor" && <Stethoscope className="w-4 h-4" />}
              {activeRole === "student" && <GraduationCap className="w-4 h-4" />}
              {activeRole === "patient" && <HeartHandshake className="w-4 h-4" />}
            </div>
            <div className="overflow-hidden">
              <div className="font-bold text-xs text-white truncate">
                {activeRole === "doctor" && (t.seniorVaidya || "Senior Vaidya Workspace")}
                {activeRole === "student" && (t.academicScholar || "BAMS Scholar Workspace")}
                {activeRole === "patient" && (t.registeredPatient || "Patient Swastha Workspace")}
              </div>
              <div className="text-[10px] text-stone-300 truncate">
                {currentUser?.email || currentUser?.name || (activeRole === "doctor" ? "dr.rao@sdm.ac.in" : activeRole === "student" ? "scholar@sdm.ac.in" : "patient@ayuressence.in")}
              </div>
            </div>
          </div>
          <p className="text-[9px] text-stone-400 mt-1.5 leading-tight italic">
            {t.switchDomainNotice || "To switch between Doctor, Student, or Patient portals, please log out."}
          </p>
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
            <span>{t.navSamhitaReferences || "Samhita References"}</span>
          </button>

          {/* User Profile Card / Auth Button */}
          <button
            type="button"
            onClick={onOpenAuthModal}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-emerald-900/50 hover:bg-emerald-900/80 border border-emerald-800/80 transition-all text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            title="Clinician Session"
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

          {onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-rose-950/60 hover:bg-rose-900/70 text-rose-200 border border-rose-800/60 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t.logoutBtn || "Log Out"}</span>
            </button>
          )}
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

            {/* Active Domain Workspace Badge (Strict Isolation: No switching to other 2 roles) */}
            <div className="my-3 px-3 py-2.5 bg-[#122A22] rounded-2xl border border-emerald-800/80 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-between">
                <span>{t.activeWorkspace || "Active Workspace"}</span>
                <span className="text-[9px] text-amber-400 font-mono">{t.loggedAs || "Logged in"}</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  activeRole === "doctor"
                    ? "bg-amber-500 text-stone-950"
                    : activeRole === "student"
                    ? "bg-sky-500 text-white"
                    : "bg-emerald-500 text-stone-950"
                }`}>
                  {activeRole === "doctor" && <Stethoscope className="w-3.5 h-3.5" />}
                  {activeRole === "student" && <GraduationCap className="w-3.5 h-3.5" />}
                  {activeRole === "patient" && <HeartHandshake className="w-3.5 h-3.5" />}
                </div>
                <div className="text-xs font-bold text-white">
                  {activeRole === "doctor" && (t.seniorVaidya || "Senior Vaidya Workspace")}
                  {activeRole === "student" && (t.academicScholar || "BAMS Scholar Workspace")}
                  {activeRole === "patient" && (t.registeredPatient || "Patient Swastha Workspace")}
                </div>
              </div>
              <p className="text-[9px] text-stone-400 italic pt-1">
                {t.switchDomainNotice || "To switch between Doctor, Student, or Patient portals, please log out."}
              </p>
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
                <span>{t.navSamhitaReferences || "Samhita References"}</span>
              </button>

              {onSignOut && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onSignOut();
                  }}
                  className="w-full py-2.5 min-h-[44px] bg-rose-950/70 hover:bg-rose-900/80 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 text-rose-200 border border-rose-700/60"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t.logoutBtn || "Log Out"}</span>
                </button>
              )}
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
        <div className="no-print bg-[#FAF8F5] border-b border-stone-200/80 px-4 sm:px-8 py-2 text-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-stone-500 text-[11px]">
            <span className="font-semibold text-emerald-900 uppercase tracking-wide">
              TridoshaLab • Academic Calibration
            </span>
            <span>•</span>
            <span className="hidden sm:inline">SDM College of Ayurveda, Udupi & SMVITM Bantakal</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Real-time Notification Bell for Doctor / Scholar */}
            <button
              type="button"
              onClick={() => onTabChange("reviewQueue")}
              className="relative p-1.5 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 transition-colors flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              title={pendingReviewCount > 0 ? `${pendingReviewCount} assessments awaiting doctor review` : t.noNotifications || "No pending notifications"}
              aria-label="Pending reviews notification"
            >
              <Bell className="w-4 h-4 text-emerald-900" />
              {pendingReviewCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-stone-950 font-bold text-[10px] rounded-full flex items-center justify-center shadow-xs">
                  {pendingReviewCount}
                </span>
              )}
            </button>

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

            {/* Sign Out / Switch Portal Button */}
            {onSignOut && (
              <button
                type="button"
                onClick={onSignOut}
                className="px-2.5 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                title="Sign out and return to portal selection"
              >
                <LogOut className="w-3 h-3" />
                <span>{t.signOut || "Sign Out"}</span>
              </button>
            )}
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
