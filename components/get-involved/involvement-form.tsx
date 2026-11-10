'use client';

import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { CheckCircle } from 'lucide-react';
import { INTEREST_OPTIONS, useInvolvementStore, type InvolvementTextField } from '@/store';

export function InvolvementForm() {
  const {
    formData,
    isSubmitted,
    isSubmitting,
    error,
    setField,
    toggleInterestArea,
    submit,
    reset,
  } = useInvolvementStore(useShallow((state) => state));

  useEffect(() => reset, [reset]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setField(e.target.name as InvolvementTextField, e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a3a52] mb-2">
            Join Our Community
          </h2>
          <p className="text-gray-600 mb-8">
            Fill out the form below to get involved with RYGN and be part of a movement shaping Rwanda&apos;s nuclear future.
          </p>

          {isSubmitted && (
            <div className="mb-8 p-4 bg-green-100 border border-green-400 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-green-800">Thank you for getting involved!</h3>
                <p className="text-green-700 text-sm">We&apos;ll get back to you shortly.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-300 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#1a3a52] mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d9c4a] disabled:opacity-60"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1a3a52] mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d9c4a] disabled:opacity-60"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1a3a52] mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d9c4a] disabled:opacity-60"
                placeholder="+250 123 456 789"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1a3a52] mb-3">
                Areas of Interest
              </label>
              <div className="space-y-3">
                {INTEREST_OPTIONS.map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      id={option}
                      checked={formData.interestAreas.includes(option)}
                      onChange={() => toggleInterestArea(option)}
                      disabled={isSubmitting}
                      className="w-4 h-4 text-[#2d9c4a] border-gray-300 rounded focus:ring-[#2d9c4a] disabled:opacity-60"
                    />
                    <label htmlFor={option} className="ml-3 text-gray-700 cursor-pointer">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1a3a52] mb-2">
                Message (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d9c4a] disabled:opacity-60"
                placeholder="Tell us about your interests and goals..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#2d9c4a] text-white px-6 py-3 rounded-lg hover:bg-[#239a41] transition-colors font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
