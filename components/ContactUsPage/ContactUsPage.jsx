"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import {
  Phone, Mail, MapPin, Clock, Send, CheckCircle,
  MessageSquare, HeadphonesIcon, ChevronDown, Loader2,
  Instagram, Twitter, Facebook, Youtube,
} from 'lucide-react'

/* ─────────────────────────────────────────────
   CONTACT DATA
───────────────────────────────────────────── */
const CONTACT_INFO = [
  {
    icon: Phone, iconBg: 'bg-blue-50', iconColor: 'text-blue-600',
    title: 'Call Us',
    lines: ['+91 1800-000-0000', '+91 9876-543-210'],
    sub: 'Mon – Sat, 9 AM – 7 PM',
  },
  {
    icon: Mail, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600',
    title: 'Email Us',
    lines: ['support@men10.com', 'hello@men10.com'],
    sub: 'We reply within 24 hours',
  },
  {
    icon: MapPin, iconBg: 'bg-orange-50', iconColor: 'text-orange-500',
    title: 'Visit Us',
    lines: ['Plot 12, MG Road,', 'Nagpur, Maharashtra 440001'],
    sub: 'Clinic hours: 10 AM – 6 PM',
  },
  {
    icon: Clock, iconBg: 'bg-purple-50', iconColor: 'text-purple-600',
    title: 'Working Hours',
    lines: ['Monday – Saturday', '9:00 AM – 7:00 PM'],
    sub: 'Sunday: Emergency only',
  },
]

const SUBJECTS = [
  'General Inquiry', 'Appointment Booking', 'Teleconsultation Support',
  'Medicine Order Issue', 'Billing & Refund', 'Technical Support',
  'Feedback / Suggestion', 'Other',
]

/* ─────────────────────────────────────────────
   CONTACT PAGE
───────────────────────────────────────────── */
const ContactUsPage = () => {
  const [form, setForm]         = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [errors, setErrors]     = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim())    errs.name    = 'Name is required'
    if (!form.email.trim())   errs.email   = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.phone.trim())   errs.phone   = 'Phone number is required'
    if (!form.subject)        errs.subject = 'Please select a subject'
    if (!form.message.trim()) errs.message = 'Message cannot be empty'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1800))
    setSubmitting(false)
    setSubmitted(true)
  }

  const handleReset = () => {
    setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    setErrors({})
    setSubmitted(false)
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans">
      <main>

        {/* HERO */}
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 overflow-hidden">
          <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/5" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-white/5" />
          <div className="relative max-w-6xl mx-auto px-4 md:px-6 py-14 md:py-20">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4">
                  <HeadphonesIcon size={13} /> We're here to help
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                  Get In <span className="text-blue-200">Touch</span>
                </h1>
                <p className="text-blue-100 mt-3 text-base max-w-md">
                  Have a question, concern, or just want to say hello? Our team is ready to assist you.
                </p>
              </div>
              <div className="flex gap-3">
                {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                  <a key={i} href="#"
                    className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-blue-600 transition-all">
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 space-y-8">

          {/* INFO CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CONTACT_INFO.map((info) => {
              const Icon = info.icon
              return (
                <div key={info.title}
                  className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                  <div className={`w-11 h-11 rounded-xl ${info.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={info.iconColor} size={20} />
                  </div>
                  <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">{info.title}</p>
                  {info.lines.map(line => (
                    <p key={line} className="text-sm font-semibold text-slate-800 leading-snug">{line}</p>
                  ))}
                  <p className="text-xs text-slate-400 mt-2">{info.sub}</p>
                </div>
              )
            })}
          </div>

          {/* FORM + SIDEBAR */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* FORM */}
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <MessageSquare className="text-blue-600" size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Send a Message</h2>
                  <p className="text-xs text-slate-400">Fill in the form and we'll get back to you</p>
                </div>
              </div>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-5">
                    <CheckCircle className="text-emerald-500" size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Message Sent!</h3>
                  <p className="text-slate-500 text-sm max-w-xs">
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                  <button onClick={handleReset}
                    className="mt-6 px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors shadow-md shadow-blue-100">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input name="name" value={form.name} onChange={handleChange}
                        placeholder="e.g. Rahul Sharma"
                        className={`w-full p-2.5 border rounded-xl text-sm outline-none focus:border-blue-500 bg-slate-50 transition-colors ${errors.name ? 'border-red-400 bg-red-50' : 'border-slate-200'}`} />
                      {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input name="email" value={form.email} onChange={handleChange} type="email"
                        placeholder="e.g. rahul@gmail.com"
                        className={`w-full p-2.5 border rounded-xl text-sm outline-none focus:border-blue-500 bg-slate-50 transition-colors ${errors.email ? 'border-red-400 bg-red-50' : 'border-slate-200'}`} />
                      {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input name="phone" value={form.phone} onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className={`w-full p-2.5 border rounded-xl text-sm outline-none focus:border-blue-500 bg-slate-50 transition-colors ${errors.phone ? 'border-red-400 bg-red-50' : 'border-slate-200'}`} />
                      {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select name="subject" value={form.subject} onChange={handleChange}
                          className={`w-full appearance-none p-2.5 border rounded-xl text-sm outline-none focus:border-blue-500 bg-slate-50 transition-colors ${errors.subject ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}>
                          <option value="">Select subject...</option>
                          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={15} />
                      </div>
                      {errors.subject && <p className="text-red-500 text-[10px] mt-1">{errors.subject}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea name="message" value={form.message} onChange={handleChange}
                      rows={5} placeholder="Describe your issue or query in detail..."
                      className={`w-full p-2.5 border rounded-xl text-sm outline-none focus:border-blue-500 bg-slate-50 resize-none transition-colors ${errors.message ? 'border-red-400 bg-red-50' : 'border-slate-200'}`} />
                    {errors.message && <p className="text-red-500 text-[10px] mt-1">{errors.message}</p>}
                    <p className="text-[10px] text-slate-400 text-right mt-1">{form.message.length} / 500</p>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={handleReset}
                      className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-bold transition-colors">
                      Clear
                    </button>
                    <button type="submit" disabled={submitting}
                      className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:bg-blue-400 disabled:cursor-not-allowed">
                      {submitting
                        ? <><Loader2 size={16} className="animate-spin" /> Sending...</>
                        : <><Send size={15} /> Send Message</>
                      }
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* SIDEBAR */}
            <div className="lg:col-span-2 space-y-4">

              {/* MAP */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="h-52 w-full">
                  <iframe
                    title="Men10 Nagpur Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.902418577563!2d79.07918531490754!3d21.14580548591906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c0a5a31faf63%3A0x3a6b4df417216ec0!2sMG%20Rd%2C%20Nagpur%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1649000000000!5m2!1sen!2sin"
                    width="100%" height="100%"
                    style={{ border: 0 }}
                    allowFullScreen loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm font-bold text-slate-800">Men10 Clinic — Nagpur</p>
                  <p className="text-xs text-slate-400 mt-0.5">Plot 12, MG Road, Nagpur, Maharashtra 440001</p>
                  <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                    <MapPin size={12} /> Get Directions →
                  </a>
                </div>
              </div>

              {/* QUICK CONTACT */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
                <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Quick Contact</p>
                <a href="tel:+911800000000"
                  className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                    <Phone className="text-white" size={15} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Helpline</p>
                    <p className="text-sm font-bold text-blue-600">1800-000-0000</p>
                  </div>
                </a>
                <a href="mailto:support@men10.com"
                  className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
                    <Mail className="text-white" size={15} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Email Support</p>
                    <p className="text-sm font-bold text-emerald-600">support@men10.com</p>
                  </div>
                </a>
              </div>

              {/* FAQ TEASER */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 text-white">
                <p className="text-xs font-extrabold uppercase tracking-widest text-blue-200 mb-2">Need Quick Answers?</p>
                <p className="font-bold text-base mb-1">Check our FAQ</p>
                <p className="text-xs text-blue-200 mb-4">Most common questions answered instantly.</p>
                <Link href="/faq"
                  className="inline-flex items-center gap-2 bg-white text-blue-600 text-xs font-extrabold px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors shadow-md">
                  View FAQ →
                </Link>
              </div>
            </div>
          </div>

          {/* BOTTOM CTA */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <HeadphonesIcon className="text-white" size={18} />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Need Immediate Help?</p>
                <p className="text-xs text-slate-400">Our support team is just one call away</p>
              </div>
            </div>
            <a href="tel:+917800102108"
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100 transition-all active:scale-95 whitespace-nowrap">
              <Phone size={15} /> Call Now
            </a>
          </div>

        </div>
      </main>
    </div>
  )
}

export default ContactUsPage