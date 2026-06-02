import React from "react";
import { SeoHead } from "@/components/seo-head";
import { PageHero } from "@/components/ui/page-hero";
import { FileText, Shield, Users, AlertTriangle, Mail, ExternalLink } from "lucide-react";

const SECTIONS = [
  {
    icon: <FileText className="w-5 h-5" />,
    title: "Acceptance of Terms",
    content: [
      "By accessing or using the Kaimosi Friends University (KAFU) website and its associated digital services, you agree to be bound by these Terms of Service and all applicable laws and regulations.",
      "If you do not agree with any of these terms, you are prohibited from using or accessing this website. These terms apply to all visitors, users, and others who access or use the services.",
      "KAFU reserves the right to modify these terms at any time. Continued use of the website following any changes constitutes acceptance of the revised terms. The date of the most recent revision is shown at the bottom of this page.",
    ],
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Intellectual Property",
    content: [
      "The content on this website — including but not limited to text, graphics, logos, images, audio clips, digital downloads, and data compilations — is the property of Kaimosi Friends University or its content suppliers and is protected by Kenyan and international copyright laws.",
      "You may view, download, and print pages from this website for personal, non-commercial use, provided that you retain all copyright and other proprietary notices. You must not reproduce, distribute, modify, create derivative works, publicly display, or commercially exploit any content without prior written consent from KAFU.",
      "The KAFU name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of Kaimosi Friends University. You must not use such marks without the prior written permission of the University.",
    ],
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Acceptable Use",
    content: [
      "You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of, or restrict or inhibit the use and enjoyment of, this website by any third party.",
      "Prohibited conduct includes, but is not limited to: transmitting any unsolicited or unauthorised advertising or promotional material; attempting to gain unauthorised access to any part of the website or its related systems; engaging in conduct that is unlawful, fraudulent, threatening, abusive, defamatory, obscene, or otherwise objectionable; and using the website in a way that could damage, disable, overburden, or impair any KAFU server or network.",
      "Academic and research data obtained from this website must be used in accordance with applicable data protection legislation, including the Kenya Data Protection Act, 2019.",
    ],
  },
  {
    icon: <AlertTriangle className="w-5 h-5" />,
    title: "Disclaimer of Warranties",
    content: [
      "This website is provided on an 'as is' and 'as available' basis without any warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.",
      "KAFU does not warrant that: the website will be uninterrupted or error-free; defects will be corrected; the website or the server that makes it available are free of viruses or other harmful components; or the results of using the website will be accurate or reliable.",
      "Information on this website is intended for general guidance only. For academic, admissions, legal, or financial decisions, please contact the relevant university office directly or consult official KAFU publications.",
    ],
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: "Limitation of Liability",
    content: [
      "To the fullest extent permitted by applicable law, Kaimosi Friends University shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of, or inability to use, this website or its content.",
      "KAFU makes reasonable efforts to ensure that information on this website is accurate and up to date. However, KAFU does not accept responsibility for any loss or damage that may arise from reliance on information contained herein.",
      "Links to external websites are provided for your convenience only. KAFU does not endorse or accept responsibility for the content, privacy practices, or reliability of external websites.",
    ],
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Privacy & Data Protection",
    content: [
      "Your use of this website is also governed by our Privacy Policy, which is incorporated into these Terms of Service by reference. Please review our Privacy Policy to understand our practices regarding the collection and use of your personal information.",
      "KAFU is committed to compliance with the Kenya Data Protection Act, 2019. Personal data collected through this website is processed lawfully, fairly, and transparently for specified, explicit, and legitimate purposes.",
      "For queries about data protection or to exercise your data subject rights, please contact the KAFU Data Protection Officer at dpo@kafu.ac.ke.",
    ],
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: "Governing Law",
    content: [
      "These Terms of Service are governed by and construed in accordance with the laws of Kenya. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the courts of Kenya.",
      "These terms constitute the entire agreement between you and Kaimosi Friends University regarding the use of this website, superseding any prior agreements.",
      "If any provision of these terms is found to be invalid or unenforceable by a court of competent jurisdiction, the remaining provisions shall remain in full force and effect.",
    ],
  },
];

export default function TermsOfService() {
  return (
    <div className="flex flex-col min-h-screen">
      <SeoHead
        title="Terms of Service | KAFU"
        description="The terms governing use of the Kaimosi Friends University website and digital services, including acceptable use, intellectual property, and disclaimer of warranties."
        path="/terms"
        breadcrumbs={[{ name: "Terms of Service" }]}
      />

      <PageHero
        title="Terms of Service"
        subtitle="The terms and conditions governing your use of the KAFU website and digital services"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Terms of Service" },
        ]}
      />

      {/* Intro */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 mb-8 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800 mb-1">Please read these terms carefully before using our website.</p>
              <p className="text-sm text-amber-700">
                These terms apply to <strong>kafu.ac.ke</strong> and all associated KAFU digital platforms. By continuing to use our website you agree to these terms.
              </p>
            </div>
          </div>

          <div className="prose max-w-none text-gray-700 mb-6">
            <p className="text-base leading-relaxed">
              These Terms of Service ("Terms") govern your access to and use of the Kaimosi Friends University website, its sub-domains, and associated digital services (collectively, the "Website"). These Terms are established in accordance with the Universities Act No. 42 of 2012, the Kenya Information and Communications Act, and the Kenya Data Protection Act, 2019.
            </p>
          </div>
        </div>
      </section>

      {/* Main sections */}
      <section className="py-4 pb-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
          {SECTIONS.map((section, i) => (
            <div key={i} className="border-t border-gray-100 pt-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                  {section.icon}
                </div>
                <h2 className="text-xl font-bold font-serif text-gray-900">{section.title}</h2>
              </div>
              <div className="space-y-3 pl-11">
                {section.content.map((para, j) => (
                  <p key={j} className="text-gray-700 leading-relaxed text-base">{para}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold font-serif text-gray-900 mb-3">Questions About These Terms?</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                If you have any questions or concerns about these Terms of Service, please contact the KAFU Legal Office.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-green-700" />
                  <a href="mailto:legal@kafu.ac.ke" className="text-green-700 hover:underline">legal@kafu.ac.ke</a>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-gray-800">Related Policies</h3>
              <div className="space-y-2 text-sm">
                <a href="/about/policies" className="flex items-center gap-2 text-green-700 hover:underline">
                  <FileText className="w-4 h-4" /> University Policies & Regulations
                </a>
                <a href="/about/service-charter" className="flex items-center gap-2 text-green-700 hover:underline">
                  <Shield className="w-4 h-4" /> Service Charter
                </a>
                <a href="/about/legal" className="flex items-center gap-2 text-green-700 hover:underline">
                  <ExternalLink className="w-4 h-4" /> Legal Office
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 text-xs text-gray-400">
            Last revised: January 2025. These terms are reviewed annually by the KAFU Legal Office.
          </div>
        </div>
      </section>
    </div>
  );
}
