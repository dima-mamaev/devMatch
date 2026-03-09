"use client";

import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { MailIcon, MapPinIcon } from "@/components/icons";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const subjectOptions = [
  { value: "general", label: "General Inquiry" },
  { value: "support", label: "Technical Support" },
  { value: "billing", label: "Billing Question" },
  { value: "partnership", label: "Partnership Opportunity" },
  { value: "feedback", label: "Feedback" },
];

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>();

  const onSubmit = async () => {
    reset();
    toast.success("Message sent successfully!", {
      description: "Thanks for reaching out! We'll get back to you within 24-48 hours.",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-slate-900 mb-3">
              Get in Touch
            </h1>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Have a question or feedback? We&apos;d love to hear from you. Fill out the form
              below and we&apos;ll get back to you as soon as possible.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                      <MailIcon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Email</p>
                      <a
                        href="mailto:hello@devmatch.io"
                        className="text-sm text-indigo-600 hover:underline"
                      >
                        hello@devmatch.io
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                      <MapPinIcon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Location</p>
                      <p className="text-sm text-slate-500">San Francisco, CA</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-indigo-900 mb-2">
                  Response Time
                </h3>
                <p className="text-sm text-indigo-700">
                  We typically respond within 24-48 hours during business days.
                </p>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <Input
                      label="Your Name"
                      placeholder="John Doe"
                      error={errors.name?.message}
                      {...register("name", { required: "Name is required" })}
                    />
                    <Input
                      type="email"
                      label="Email Address"
                      placeholder="john@example.com"
                      error={errors.email?.message}
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                  </div>
                  <Controller
                    name="subject"
                    control={control}
                    rules={{ required: "Please select a subject" }}
                    render={({ field }) => (
                      <Select
                        label="Subject"
                        options={subjectOptions}
                        placeholder="Select a topic"
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.subject?.message}
                      />
                    )}
                  />
                  <Textarea
                    label="Message"
                    placeholder="How can we help you?"
                    rows={5}
                    error={errors.message?.message}
                    {...register("message", {
                      required: "Message is required",
                      minLength: {
                        value: 10,
                        message: "Message must be at least 10 characters",
                      },
                    })}
                  />
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
