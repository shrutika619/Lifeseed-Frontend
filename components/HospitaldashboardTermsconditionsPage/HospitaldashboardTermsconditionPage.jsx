'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const Men10PrivacyNoticePage = () => {
  const [activeSection, setActiveSection] = useState('s1')
  const [showBackTop, setShowBackTop] = useState(false)
  const sectionsRef = useRef([])

  const tocItems = [
    { id: 's1',  label: '1. What Information We Collect' },
    { id: 's2',  label: '2. How We Use Your Information' },
    { id: 's3',  label: '3. Will Your Information Be Shared' },
    { id: 's4',  label: '4. Cookies & Tracking Technologies' },
    { id: 's5',  label: '5. How Long Do We Keep Your Info' },
    { id: 's6',  label: '6. How Do We Keep Your Info Safe' },
    { id: 's7',  label: '7. What Are Your Privacy Rights' },
    { id: 's8',  label: '8. Data Breach Procedures' },
    { id: 's9',  label: '9. Controls for Do-Not-Track' },
    { id: 's10', label: '10. California Privacy Rights' },
    { id: 's11', label: '11. India Data Protection' },
    { id: 's12', label: '12. Do We Make Updates' },
    { id: 's13', label: '13. How to Contact Us' },
    { id: 's14', label: '14. Review, Update or Delete Data' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setShowBackTop(window.scrollY > 400)

      const sectionEls = tocItems.map(t => document.getElementById(t.id)).filter(Boolean)
      for (let i = sectionEls.length - 1; i >= 0; i--) {
        const rect = sectionEls[i].getBoundingClientRect()
        if (rect.top <= window.innerHeight * 0.25) {
          setActiveSection(sectionEls[i].id)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '13.5px', color: '#1a1a2e', lineHeight: 1.7, background: '#fff' }}>

      {/* ── PRIVACY HERO (ProCohat layout — logo top-left, then PRIVACY NOTICE heading) ── */}
      <section style={{
        background: '#fff',
        padding: '48px 56px 44px',
        borderBottom: '2px solid #f3f4f6',
        maxWidth: '1100px',
        margin: '0 auto',
      }}>

        {/* Logo — large, left-aligned, exactly like ProCohat */}
        <div style={{ marginBottom: '32px' }}>
          <Image
            src="/Images/Logo.svg"
            alt="MEN10 Logo"
            width={160}
            height={120}
            priority
            style={{ height: '120px', width: 'auto', display: 'block', marginLeft: '-18px' }}
          />
        </div>

        <h1 style={{
          fontSize: '26px',
          fontWeight: 800,
          color: '#0f172a',
          letterSpacing: '0.8px',
          textTransform: 'uppercase',
          marginBottom: '6px',
        }}>
          Legal Agreement
        </h1>

        <div style={{ fontSize: '13.5px', color: '#0f172a', fontWeight: 700, marginBottom: '32px', marginTop: '10px' }}>
          Last updated [22nd January, 2026]
        </div>

        <p style={{
          fontSize: '14px',
          color: '#374151',
          lineHeight: 1.85,
          maxWidth: '820px',
          fontWeight: 400,
          margin: 0,
        }}>
          This Privacy Notice describes how <strong>MEN10</strong> (a brand owned and operated by{' '}
          <strong>Menten Healthcare Private Limited</strong>, "we", "us", "our") collects, uses, and shares
          information about you when you use our Services — including our website{' '}
          <a href="https://www.men10.co.in" style={{ color: '#1e40af', fontWeight: 500 }}>www.men10.co.in</a>,
          mobile application, and all related online products and services. Please read this carefully.{' '}
          <button onClick={() => scrollTo('s13')} style={{ color: '#1e40af', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>
            Contact us
          </button>{' '}
          if you have any questions.
        </p>
      </section>

      {/* ── BODY LAYOUT ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '230px 1fr',
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '44px 24px',
        gap: '52px',
      }}>

        {/* ── SIDEBAR TOC ── */}
        <aside style={{ position: 'sticky', top: '24px', alignSelf: 'start', maxHeight: 'calc(100vh - 48px)', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#94a3b8', margin: 0 }}>
              Contents
            </h3>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>
          {tocItems.map(item => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                background: activeSection === item.id ? '#f0f7ff' : 'none',
                border: 'none',
                borderLeft: `2px solid ${activeSection === item.id ? '#1e40af' : '#f1f5f9'}`,
                borderRadius: activeSection === item.id ? '0 4px 4px 0' : '0',
                fontSize: '12px',
                color: activeSection === item.id ? '#1e40af' : '#64748b',
                fontWeight: activeSection === item.id ? 600 : 400,
                padding: activeSection === item.id ? '5px 8px 5px 12px' : '5px 0 5px 12px',
                lineHeight: 1.4,
                marginBottom: '1px',
                cursor: 'pointer',
                transition: 'all .15s',
              }}
            >
              {item.label}
            </button>
          ))}
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div style={{ minWidth: 0 }}>

          {/* Info Box */}
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '16px 20px', marginBottom: '24px', fontSize: '13px', color: '#1e40af', lineHeight: 1.7 }}>
            <strong>Summary:</strong> This notice applies to all information collected through our Services and any related services, sales, marketing, or events. We are committed to full transparency about how we handle your personal data.
          </div>

          {/* Section Component Helper */}
          {[
            {
              id: 's1', num: '01', title: 'WHAT INFORMATION DO WE COLLECT?',
              content: (
                <>
                  <h3 style={h3Style}>Information you provide to us</h3>
                  <p style={pStyle}>We collect personal information that you voluntarily provide when you register on the Services, express interest in our products, participate in activities, or contact us:</p>
                  <ul style={ulStyle}>
                    <li style={liStyle}><strong>Personal identifiers:</strong> Names, phone numbers, email addresses, usernames, passwords</li>
                    <li style={liStyle}><strong>Medical information:</strong> Health conditions, medical history, prescriptions, consultation records</li>
                    <li style={liStyle}><strong>Professional information:</strong> Doctor registration number, medical qualifications, specialization, clinic details</li>
                    <li style={liStyle}><strong>Payment information:</strong> UPI ID, bank account details, billing address</li>
                    <li style={liStyle}><strong>Contact data:</strong> Mailing address, city, state, PIN code</li>
                  </ul>
                  <p style={pStyle}>All personal information you provide must be true, complete, and accurate.</p>
                  <h3 style={h3Style}>Information automatically collected</h3>
                  <p style={pStyle}>We automatically collect device and usage information such as your IP address, browser characteristics, operating system, language preferences, referring URLs, device name, country, and location.</p>
                  <h3 style={h3Style}>Information collected from other sources</h3>
                  <p style={pStyle}>We may collect information from public databases, joint marketing partners, and other third parties to update records and provide customized healthcare recommendations.</p>
                  <h3 style={h3Style}>Sensitive personal information</h3>
                  <p style={pStyle}>We collect sensitive personal information including sexual health and wellness data, treated with the highest level of confidentiality and enhanced security measures.</p>
                </>
              )
            },
            {
              id: 's2', num: '02', title: 'HOW DO WE USE YOUR INFORMATION?',
              content: (
                <>
                  <p style={pStyle}>We process your personal information based on legitimate business interests, contractual obligations, your consent, and legal compliance.</p>
                  <h3 style={h3Style}>We use the information we collect or receive to:</h3>
                  <ul style={ulStyle}>
                    <li style={liStyle}><strong>Facilitate account creation and logon process</strong> — Set up and maintain your MEN10 account</li>
                    <li style={liStyle}><strong>Deliver and facilitate services</strong> — Book OPD appointments, facilitate teleconsultations, and manage your healthcare journey</li>
                    <li style={liStyle}><strong>Send administrative information</strong> — Appointment confirmations, booking updates, policy changes</li>
                    <li style={liStyle}><strong>Fulfill and manage your orders</strong> — Process payments and manage consultation bookings</li>
                    <li style={liStyle}><strong>Request feedback</strong> — Gather insights to improve our services and doctor quality</li>
                    <li style={liStyle}><strong>Enable user-to-user communications</strong> — With your consent, connect you with healthcare providers</li>
                    <li style={liStyle}><strong>Send marketing communications</strong> — With your consent, health tips, offers, and relevant updates</li>
                    <li style={liStyle}><strong>Deliver targeted advertising</strong> — Healthcare-relevant ads based on your interests and usage</li>
                    <li style={liStyle}><strong>Protect our Services</strong> — Fraud monitoring and security efforts</li>
                    <li style={liStyle}><strong>Enforce our terms and policies</strong> — Including our Clinic Partner Agreement</li>
                    <li style={liStyle}><strong>Respond to legal requests</strong> — Share data as per court order or regulatory requirement</li>
                  </ul>
                  <p style={pStyle}><strong>For Clinic Partners:</strong> We use your information to manage your clinic listing, process patient bookings, handle payments, and provide analytics about your OPD performance.</p>
                </>
              )
            },
            {
              id: 's3', num: '03', title: 'WILL YOUR INFORMATION BE SHARED WITH ANYONE?',
              content: (
                <>
                  <p style={pStyle}>We only share information with your consent, to comply with laws, to provide services, to protect your rights, or to fulfill business obligations:</p>
                  <ul style={ulStyle}>
                    <li style={liStyle}><strong>Consent:</strong> We may disclose your personal information for any purpose with your explicit consent</li>
                    <li style={liStyle}><strong>Legitimate Interests:</strong> When we have a legitimate business interest not overridden by your rights</li>
                    <li style={liStyle}><strong>Performance of a Contract:</strong> To fulfill our contractual obligations to you as a patient or clinic partner</li>
                    <li style={liStyle}><strong>Legal Obligations:</strong> To comply with our legal obligations, NMC guidelines, or court orders</li>
                    <li style={liStyle}><strong>Vital Interests:</strong> Where necessary to protect your vital interests or those of another person</li>
                  </ul>
                  <h3 style={h3Style}>Vendors, Consultants and Third-Party Service Providers</h3>
                  <p style={pStyle}>We may share your data with third-party vendors for payment processing, data analysis, email delivery, hosting services, customer service, and marketing. All third parties must respect the security of your personal data.</p>
                  <h3 style={h3Style}>Business Transfers</h3>
                  <p style={pStyle}>We may share or transfer your information in connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business.</p>
                </>
              )
            },
            {
              id: 's4', num: '04', title: 'DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?',
              content: (
                <>
                  <p style={pStyle}>We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information.</p>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px', fontSize: '12.5px' }}>
                    <thead>
                      <tr>
                        {['Cookie Type', 'Purpose', 'Duration'].map(h => (
                          <th key={h} style={{ background: '#f1f5f9', fontWeight: 600, color: '#374151', padding: '10px 14px', textAlign: 'left', border: '1px solid #e2e8f0' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Essential Cookies', 'Required for the website to function. Enable login sessions, security features, and basic navigation', 'Session'],
                        ['Analytics Cookies', 'Help us understand how visitors interact with our website by collecting information anonymously', '2 Years'],
                        ['Preference Cookies', 'Enable the website to remember preferences such as language, region, and login details', '1 Year'],
                        ['Marketing Cookies', 'Used to track visitors across websites to display relevant healthcare advertisements', '90 Days'],
                        ['Functional Cookies', 'Provide enhanced functionality such as appointment reminders and doctor recommendations', '6 Months'],
                        ['Security Cookies', 'Used for authentication, prevent fraud, and protect user information during browsing', 'Session'],
                        ['Third-Party Cookies', 'Set by third-party services such as Google Analytics, payment gateways, and social media integrations', 'Varies'],
                      ].map(([type, purpose, duration]) => (
                        <tr key={type}>
                          <td style={{ padding: '10px 14px', border: '1px solid #e2e8f0', color: '#475569', verticalAlign: 'top', lineHeight: 1.6 }}><strong>{type}</strong></td>
                          <td style={{ padding: '10px 14px', border: '1px solid #e2e8f0', color: '#475569', verticalAlign: 'top', lineHeight: 1.6 }}>{purpose}</td>
                          <td style={{ padding: '10px 14px', border: '1px solid #e2e8f0', color: '#475569', verticalAlign: 'top', lineHeight: 1.6 }}>{duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p style={pStyle}>You can set your browser to refuse all or some cookies. Note that some parts of the website may become inaccessible if cookies are disabled.</p>
                </>
              )
            },
            {
              id: 's5', num: '05', title: 'HOW LONG DO WE KEEP YOUR INFORMATION?',
              content: (
                <>
                  <p style={pStyle}>We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required by law.</p>
                  <h3 style={h3Style}>Retention periods by data type:</h3>
                  <ul style={ulStyle}>
                    <li style={liStyle}><strong>Account information:</strong> Duration of your account plus 3 years after closure</li>
                    <li style={liStyle}><strong>Medical records & consultation history:</strong> 7 years as required under medical regulations</li>
                    <li style={liStyle}><strong>Payment records:</strong> 8 years as required under Indian tax laws</li>
                    <li style={liStyle}><strong>Marketing preferences:</strong> Until you withdraw consent or 2 years of inactivity</li>
                    <li style={liStyle}><strong>Communication logs:</strong> 12 months from the date of communication</li>
                  </ul>
                  <p style={pStyle}>When we have no ongoing legitimate need to process your personal information, we will delete or anonymize it.</p>
                </>
              )
            },
            {
              id: 's6', num: '06', title: 'HOW DO WE KEEP YOUR INFORMATION SAFE?',
              content: (
                <>
                  <p style={pStyle}>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process.</p>
                  <h3 style={h3Style}>Our security measures include:</h3>
                  <ul style={ulStyle}>
                    <li style={liStyle}>SSL/TLS encryption for all data in transit</li>
                    <li style={liStyle}>AES-256 encryption for sensitive data at rest</li>
                    <li style={liStyle}>Role-based access controls (RBAC) for internal systems</li>
                    <li style={liStyle}>Regular security audits and vulnerability assessments</li>
                    <li style={liStyle}>Multi-factor authentication (MFA) for all admin accounts</li>
                    <li style={liStyle}>Data minimisation and pseudonymisation practices</li>
                    <li style={liStyle}>Secure data centres with 24/7 monitoring</li>
                    <li style={liStyle}>Employee training on data privacy and security protocols</li>
                  </ul>
                  <div style={{ background: '#fef9c3', border: '1px solid #fde047', borderRadius: '8px', padding: '16px 20px', fontSize: '13px', color: '#713f12', lineHeight: 1.7 }}>
                    <strong>Important:</strong> Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment.
                  </div>
                </>
              )
            },
            {
              id: 's7', num: '07', title: 'WHAT ARE YOUR PRIVACY RIGHTS?',
              content: (
                <>
                  <p style={pStyle}>You have certain rights under applicable data protection laws. These may include the right to:</p>
                  <ul style={ulStyle}>
                    <li style={liStyle}>Request access and obtain a copy of your personal information</li>
                    <li style={liStyle}>Request rectification or erasure of your personal information</li>
                    <li style={liStyle}>Restrict the processing of your personal information</li>
                    <li style={liStyle}>Data portability (where applicable)</li>
                    <li style={liStyle}>Object to the processing of your personal information</li>
                    <li style={liStyle}>Withdraw consent at any time where we rely on consent to process your information</li>
                  </ul>
                  <h3 style={h3Style}>Account Information</h3>
                  <p style={pStyle}>If you would like to review or change the information in your account or terminate your account, you can log in to your account settings, or contact us using the information provided in Section 13.</p>
                  <p style={pStyle}>Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information to prevent fraud, troubleshoot problems, or comply with applicable legal requirements.</p>
                  <p style={pStyle}><strong>Opting out of email marketing:</strong> You can unsubscribe from our marketing email list at any time by clicking the unsubscribe link in the emails we send.</p>
                </>
              )
            },
            {
              id: 's8', num: '08', title: 'DATA BREACH PROCEDURES',
              content: (
                <>
                  <p style={pStyle}>In the event of a personal data breach, Menten Healthcare Private Limited (MEN10) will follow the procedures outlined below in accordance with applicable Indian data protection laws.</p>
                  <h3 style={h3Style}>What we will do in case of a breach:</h3>
                  <ul style={ulStyle}>
                    <li style={liStyle}><strong>Detection & Assessment:</strong> Identify, contain, and assess the nature and scope of the breach within 24 hours</li>
                    <li style={liStyle}><strong>Internal Reporting:</strong> Report to our Data Protection Officer and senior management immediately</li>
                    <li style={liStyle}><strong>Regulatory Notification:</strong> Notify relevant authorities within 72 hours where legally required</li>
                    <li style={liStyle}><strong>User Notification:</strong> Notify affected users without undue delay where the breach is likely to result in high risk</li>
                    <li style={liStyle}><strong>Remediation:</strong> Take immediate steps to contain the breach and prevent further unauthorized access</li>
                    <li style={liStyle}><strong>Documentation:</strong> Document all data breaches regardless of whether regulatory notification is required</li>
                  </ul>
                  <p style={pStyle}>To report a security incident or data breach, please contact us immediately at: <strong>contact@men10.co.in</strong></p>
                </>
              )
            },
            {
              id: 's9', num: '09', title: 'CONTROLS FOR DO-NOT-TRACK FEATURES',
              content: (
                <>
                  <p style={pStyle}>Most web browsers and some mobile operating systems include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected.</p>
                  <p style={pStyle}>At this stage, no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online.</p>
                </>
              )
            },
            {
              id: 's10', num: '10', title: 'DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?',
              content: (
                <>
                  <p style={pStyle}>California Civil Code Section 1798.83, also known as the "Shine The Light" law, permits our users who are California residents to request information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes.</p>
                  <p style={pStyle}>If you are a California resident and would like to make such a request, please submit your request in writing using the contact information provided in Section 13. MEN10 primarily operates in India; however, if you are a California resident using our platform, you may exercise the rights described above.</p>
                </>
              )
            },
            {
              id: 's11', num: '11', title: 'INDIA DATA PROTECTION & YOUR RIGHTS',
              content: (
                <>
                  <p style={pStyle}>As an Indian company, Menten Healthcare Private Limited (MEN10) is committed to complying with the <strong>Information Technology Act, 2000</strong>, the <strong>IT (Amendment) Act 2008</strong>, the <strong>SPDI Rules 2011</strong>, and the <strong>Digital Personal Data Protection Act (DPDPA) 2023</strong>.</p>
                  <h3 style={h3Style}>Your rights under Indian law include:</h3>
                  <ul style={ulStyle}>
                    <li style={liStyle}><strong>Right to Access:</strong> You have the right to know what personal data we hold about you</li>
                    <li style={liStyle}><strong>Right to Correction:</strong> You have the right to have inaccurate personal data corrected</li>
                    <li style={liStyle}><strong>Right to Erasure:</strong> You have the right to request deletion of your personal data, subject to legal retention requirements</li>
                    <li style={liStyle}><strong>Right to Grievance Redressal:</strong> You may raise a grievance with our Data Protection Officer</li>
                    <li style={liStyle}><strong>Right to Nominate:</strong> Under DPDPA 2023, you may nominate another person to exercise your rights in case of death or incapacity</li>
                  </ul>
                  <h3 style={h3Style}>Grievance Officer</h3>
                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '16px 20px', fontSize: '13px', color: '#1e40af', lineHeight: 1.7 }}>
                    <strong>Grievance Officer — Menten Healthcare Private Limited (MEN10)</strong><br />
                    Email: <a href="mailto:contact@men10.co.in" style={{ color: '#1e40af' }}>contact@men10.co.in</a><br />
                    Phone: +91 9370808596<br />
                    Address: Nagpur, Maharashtra, India<br />
                    Response Time: Within 30 days of receipt of grievance
                  </div>
                </>
              )
            },
            {
              id: 's12', num: '12', title: 'DO WE MAKE UPDATES TO THIS NOTICE?',
              content: (
                <>
                  <p style={pStyle}>Yes, we will update this notice as necessary to stay compliant with relevant laws and to reflect changes in our data practices. The updated version will be indicated by an updated "Last Updated" date.</p>
                  <p style={pStyle}>If we make material changes to this privacy notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy notice frequently.</p>
                </>
              )
            },
            {
              id: 's13', num: '13', title: 'HOW CAN YOU CONTACT US ABOUT THIS NOTICE?',
              content: (
                <>
                  <p style={pStyle}>If you have questions or comments about this notice, you may contact us at:</p>
                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '16px 20px', fontSize: '13px', color: '#1e40af', lineHeight: 1.7 }}>
                    <strong>Menten Healthcare Private Limited</strong><br />
                    Operating under brand name: <strong>MEN10</strong><br />
                    Nagpur, Maharashtra, India<br /><br />
                    📧 Email: <a href="mailto:contact@men10.co.in" style={{ color: '#1e40af' }}>contact@men10.co.in</a><br />
                    📞 Phone: +91 9370808596<br />
                    🌐 Website: www.men10.co.in
                  </div>
                </>
              )
            },
            {
              id: 's14', num: '14', title: 'HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?',
              content: (
                <>
                  <p style={pStyle}>Based on applicable laws, you may have the right to request access to the personal information we collect from you, change that information, or delete it in some circumstances. To submit a request, please email: <a href="mailto:contact@men10.co.in" style={{ color: '#1e40af' }}>contact@men10.co.in</a></p>
                  <p style={pStyle}>We will respond to your request within <strong>30 days</strong>. In some cases, we may need to verify your identity before processing your request.</p>
                </>
              )
            },
          ].map(section => (
            <div
              key={section.id}
              id={section.id}
              style={{ marginBottom: '48px', scrollMarginTop: '24px' }}
            >
              <h2 style={{
                fontSize: '15px', fontWeight: 700, color: '#0f172a',
                marginBottom: '14px', paddingBottom: '10px',
                borderBottom: '2px solid #e2e8f0',
                display: 'flex', alignItems: 'center', gap: '10px',
              }}>
                <span style={{
                  width: '26px', height: '26px',
                  background: '#1e40af', color: '#fff',
                  borderRadius: '6px', fontSize: '11px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {section.num}
                </span>
                {section.title}
              </h2>
              {section.content}
            </div>
          ))}

        </div>
      </div>

      {/* ── CTA BANNER ── */}
      <div style={{ padding: '56px', background: '#f8faff', borderTop: '1px solid #e5e7eb' }}>
        <div style={{
          maxWidth: '1020px',
          margin: '0 auto',
          background: 'linear-gradient(130deg,#6d28d9 0%,#7c3aed 30%,#4c1d95 70%,#2d1a5e 100%)',
          borderRadius: '20px',
          padding: '44px 52px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '32px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* glow effects */}
          <div style={{ position: 'absolute', top: '-40%', right: '-5%', width: '320px', height: '320px', background: 'radial-gradient(circle,rgba(167,139,250,0.35) 0%,transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-50%', left: '25%', width: '260px', height: '260px', background: 'radial-gradient(circle,rgba(109,40,217,0.5) 0%,transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', letterSpacing: '-0.4px', marginBottom: '8px', lineHeight: 1.25 }}>
              Have Questions About Your Privacy?
            </h2>
            <p style={{ fontSize: '13.5px', color: 'rgba(255,255,255,0.7)', fontWeight: 400, lineHeight: 1.6, maxWidth: '420px', margin: 0 }}>
              Share your concerns with us and our team will get back to you within 30 days. Your data, your rights — we&apos;re here to help.
            </p>
          </div>

          <a
            href="mailto:contact@men10.co.in"
            style={{
              position: 'relative', zIndex: 2,
              background: '#fff', color: '#7c3aed',
              fontSize: '14px', fontWeight: 700,
              padding: '14px 34px', borderRadius: '50px',
              border: 'none', cursor: 'pointer',
              whiteSpace: 'nowrap', textDecoration: 'none',
              display: 'inline-block', letterSpacing: '0.2px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
              flexShrink: 0,
              transition: 'all .2s ease',
            }}
          >
            Get in touch
          </a>
        </div>
      </div>

      {/* ── BACK TO TOP ── */}
      {showBackTop && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed', bottom: '24px', right: '24px',
            width: '38px', height: '38px',
            background: '#1e40af', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', border: 'none',
            boxShadow: '0 4px 12px rgba(30,64,175,0.3)',
            zIndex: 100,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      )}
    </div>
  )
}

/* ── Shared inline styles ── */
const h3Style = {
  fontSize: '13px',
  fontWeight: 600,
  color: '#1e293b',
  margin: '18px 0 8px',
}
const pStyle = {
  fontSize: '13.5px',
  color: '#374151',
  lineHeight: 1.8,
  marginBottom: '12px',
  fontWeight: 400,
}
const ulStyle = {
  paddingLeft: '20px',
  marginBottom: '12px',
}
const liStyle = {
  fontSize: '13.5px',
  color: '#374151',
  lineHeight: 1.8,
  marginBottom: '4px',
}

export default Men10PrivacyNoticePage