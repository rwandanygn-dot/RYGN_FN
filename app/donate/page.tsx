'use client';

import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { BreadcrumbHeader } from '@/components/breadcrumb-header';
import { 
  Heart, 
  ShieldCheck, 
  CheckCircle2, 
  Send, 
  Info, 
  Award, 
  Star, 
  Crown, 
  Gem, 
  Sparkles,
  Check
} from 'lucide-react';
import { DONATION_TIER_PRICES, useDonationStore } from '@/store';

export default function DonatePage() {
  const {
    email,
    selectedTier,
    isSubmitted,
    isSubmitting: isLoading,
    error,
    setEmail,
    selectTier,
    submitPledge,
    reset,
  } = useDonationStore(useShallow((state) => state));

  useEffect(() => reset, [reset]);

  const tiers = [
    {
      id: 'Silver' as const,
      name: 'Silver Partner',
      price: DONATION_TIER_PRICES.Silver,
      icon: Award,
      badge: 'Supporter',
      badgeColor: 'bg-gray-100 text-gray-800 border-gray-200',
      description: 'Help support foundational school outreach and study materials for local students.',
      colorClass: 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white hover:bg-slate-50/50',
      selectedClass: 'ring-2 ring-[#2d9c4a] border-[#2d9c4a] bg-slate-50/80',
      iconColor: 'text-slate-400',
    },
    {
      id: 'Gold' as const,
      name: 'Gold Partner',
      price: DONATION_TIER_PRICES.Gold,
      icon: Star,
      badge: 'Advocate',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      description: 'Fund local training workshops and interactive equipment for scientific demonstrations.',
      colorClass: 'border-slate-200 hover:border-amber-200 text-amber-700 bg-white hover:bg-amber-50/20',
      selectedClass: 'ring-2 ring-[#2d9c4a] border-[#2d9c4a] bg-amber-50/30',
      iconColor: 'text-amber-500',
    },
    {
      id: 'Platinum' as const,
      name: 'Platinum Partner',
      price: DONATION_TIER_PRICES.Platinum,
      icon: Crown,
      badge: 'Champion',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
      description: 'Sponsor high-achieving youth to attend science and technology conferences nationally.',
      colorClass: 'border-slate-200 hover:border-slate-300 text-slate-800 bg-white hover:bg-slate-50/50',
      selectedClass: 'ring-2 ring-[#2d9c4a] border-[#2d9c4a] bg-slate-50/80',
      iconColor: 'text-indigo-500',
    },
    {
      id: 'Diamond' as const,
      name: 'Diamond Partner',
      price: DONATION_TIER_PRICES.Diamond,
      icon: Gem,
      badge: 'Visionary',
      badgeColor: 'bg-[#1a3a52]/10 text-[#1a3a52] border-[#1a3a52]/20',
      description: 'Drive large-scale community research initiatives, academic publications, and key advocacy.',
      colorClass: 'border-slate-200 hover:border-cyan-200 text-cyan-800 bg-white hover:bg-cyan-50/20',
      selectedClass: 'ring-2 ring-[#2d9c4a] border-[#2d9c4a] bg-cyan-50/30',
      iconColor: 'text-cyan-500',
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitPledge();
  };

  return (
    <>
      <Navigation />
      
      <BreadcrumbHeader 
        title="SUPPORT OUR MISSION" 
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Donate', href: '/donate' }
        ]}
      />

      <section className="py-12 md:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Introduction */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#1a3a52] tracking-tight mb-4">
              Partner with RYGN
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Your contribution fuels our educational outreach, training workshops, and youth empowerment initiatives across Rwanda. Choose a partnership tier below and share your email so we can coordinate your contribution.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Side: Tier Cards (8 cols on lg) */}
            <div className="lg:col-span-8 space-y-6">
              <h3 className="text-xl font-bold text-[#1a3a52] flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#2d9c4a] fill-[#2d9c4a]" />
                Select a Contribution Tier
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tiers.map((tier) => {
                  const Icon = tier.icon;
                  const isSelected = selectedTier === tier.id;
                  return (
                    <div
                      key={tier.id}
                      onClick={() => selectTier(tier.id)}
                      className={`group relative rounded-3xl p-6 border shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between h-full ${
                        isSelected ? tier.selectedClass : tier.colorClass
                      }`}
                    >
                      {/* Selection indicator */}
                      <div className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        isSelected ? 'bg-[#2d9c4a] text-white scale-100' : 'border border-gray-300 bg-white scale-90 opacity-0 group-hover:opacity-100'
                      }`}>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>

                      <div>
                        {/* Header badge & title */}
                        <div className="flex items-center gap-2.5 mb-4">
                          <div className={`p-2 rounded-xl bg-gray-50 border border-gray-100 group-hover:scale-110 transition-all ${tier.iconColor}`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${tier.badgeColor}`}>
                            {tier.badge}
                          </span>
                        </div>

                        {/* Tier Title */}
                        <h4 className="text-xl font-bold text-[#1a3a52] mb-1">
                          {tier.name}
                        </h4>
                        
                        {/* Description */}
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                          {tier.description}
                        </p>
                      </div>

                      {/* Pricing block */}
                      <div className="pt-4 border-t border-gray-100/80 flex items-baseline gap-1 animate-fade-in">
                        <span className="text-3xl font-extrabold text-[#1a3a52]">
                          ${tier.price}
                        </span>
                        <span className="text-sm font-semibold text-gray-500">
                          USD / Contribution
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex gap-3 p-4 bg-[#1a3a52]/5 rounded-2xl text-sm text-[#1a3a52] border border-[#1a3a52]/10 mt-6">
                <Info className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Have questions about other contribution methods or customizable sponsorships? Feel free to enter your email in the form, select any tier, and let us know your preferences when we reach out.
                </p>
              </div>
            </div>

            {/* Right Side: Pledge Email Form (4 cols on lg) */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 sticky top-6">
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-[#1a3a52] mb-2">Pledge Your Support</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        Enter your email address below. We will use Formspree to collect your request and reach out directly with instructions to process your transfer securely.
                      </p>
                    </div>

                    {error && (
                      <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs animate-fade-in">
                        {error}
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Selected Tier (Read-only Display) */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Selected Partnership Tier
                        </label>
                        <div className="w-full px-4 py-3 rounded-xl border border-[#2d9c4a]/30 bg-[#2d9c4a]/5 text-[#1a3a52] font-semibold text-sm flex items-center justify-between">
                          <span>{tiers.find(t => t.id === selectedTier)?.name}</span>
                          <span className="text-[#2d9c4a]">${tiers.find(t => t.id === selectedTier)?.price} USD</span>
                        </div>
                      </div>

                      {/* Email Input */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          placeholder="your-email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d9c4a]/30 focus:border-[#2d9c4a] transition-all text-sm"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <hr className="border-gray-100" />

                    <div className="space-y-4">
                      <div className="flex gap-3 items-start text-xs text-gray-500">
                        <ShieldCheck className="w-4 h-4 text-[#2d9c4a] shrink-0 mt-0.5" />
                        <p>Your details are processed securely and will never be shared. We only use this email to coordinate your pledge.</p>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#2d9c4a] text-white py-4 rounded-xl font-bold text-base hover:bg-[#239a41] transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          <>
                            <span>Send Support Request</span>
                            <Send className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Success Notification */
                  <div className="py-10 text-center space-y-6 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#2d9c4a]/10 text-[#2d9c4a] mb-2">
                      <CheckCircle2 className="w-10 h-10 animate-bounce" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-[#1a3a52]">Thank You!</h3>
                      <p className="text-sm text-[#2d9c4a] font-semibold">Your support pledge is received.</p>
                    </div>

                    <p className="text-sm text-gray-600 max-w-xs mx-auto leading-relaxed">
                      We have received your pledge for the <strong className="text-[#1a3a52]">{tiers.find(t => t.id === selectedTier)?.name} (${tiers.find(t => t.id === selectedTier)?.price} USD)</strong>. We will reach out to <strong className="text-gray-800">{email}</strong> shortly with safe contribution details.
                    </p>

                    <div className="pt-2">
                      <button
                        onClick={reset}
                        className="bg-[#1a3a52]/10 text-[#1a3a52] px-6 py-2.5 rounded-xl hover:bg-[#1a3a52]/20 transition-all text-sm font-semibold cursor-pointer"
                      >
                        Send Another Pledge
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
