import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <section className="mb-16">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Privacy Policy
            </h1>
            <p className="text-sm text-slate-500 mb-8">
              Last updated: March 2026
            </p>
            <div className="prose prose-slate max-w-none">
              <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">
                1. Information We Collect
              </h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                We collect information you provide directly to us, such as when you create an account,
                upload a profile, or contact us for support. This includes your name, email address,
                profile information, and any other information you choose to provide.
              </p>
              <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">
                2. How We Use Your Information
              </h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                We use the information we collect to provide, maintain, and improve our services,
                to communicate with you, and to personalize your experience. We may also use the
                information to send you technical notices, updates, and support messages.
              </p>

              <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">
                3. Information Sharing
              </h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                We do not sell, trade, or otherwise transfer your personal information to outside
                parties except to provide our services. Your developer profile information is visible
                to recruiters and other users of the platform as part of our core service.
              </p>

              <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">
                4. Data Security
              </h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                We implement appropriate security measures to protect your personal information
                against unauthorized access, alteration, disclosure, or destruction. However, no
                method of transmission over the Internet is 100% secure.
              </p>

              <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">
                5. Your Rights
              </h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                You have the right to access, correct, or delete your personal information at any
                time through your account settings. You may also contact us to request a copy of
                your data or to have your account permanently deleted.
              </p>

              <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">
                6. Cookies
              </h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our service
                and hold certain information. You can instruct your browser to refuse all cookies
                or to indicate when a cookie is being sent.
              </p>
            </div>
          </section>
          <div className="border-t border-slate-200 my-12" />
          <section>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Terms of Service
            </h1>
            <p className="text-sm text-slate-500 mb-8">
              Last updated: March 2024
            </p>

            <div className="prose prose-slate max-w-none">
              <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                By accessing or using DevMatch, you agree to be bound by these Terms of Service.
                If you do not agree to these terms, please do not use our service.
              </p>

              <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">
                2. Description of Service
              </h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                DevMatch is a platform that connects software developers with recruiters and
                companies through video-first profiles. We provide tools for developers to
                showcase their skills and for recruiters to discover and shortlist candidates.
              </p>

              <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">
                3. User Accounts
              </h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                You are responsible for maintaining the confidentiality of your account credentials
                and for all activities that occur under your account. You must provide accurate and
                complete information when creating an account.
              </p>

              <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">
                4. User Content
              </h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                You retain ownership of any content you submit to the platform. By uploading content,
                you grant DevMatch a non-exclusive license to use, display, and distribute your
                content in connection with our services.
              </p>

              <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">
                5. Prohibited Conduct
              </h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                You agree not to use the service to upload false information, harass other users,
                violate any laws, or interfere with the proper functioning of the platform. We
                reserve the right to terminate accounts that violate these terms.
              </p>

              <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">
                6. Limitation of Liability
              </h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                DevMatch is provided &quot;as is&quot; without warranties of any kind. We shall not be
                liable for any indirect, incidental, special, or consequential damages arising
                from your use of the service.
              </p>

              <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">
                7. Changes to Terms
              </h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users of
                any material changes by posting the new terms on this page and updating the
                &quot;Last updated&quot; date.
              </p>

              <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">
                8. Contact
              </h2>
              <p className="text-slate-600 mb-4 leading-relaxed">
                If you have any questions about these Terms, please contact us at{" "}
                <a href="mailto:legal@devmatch.io" className="text-indigo-600 hover:underline">
                  legal@devmatch.io
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
