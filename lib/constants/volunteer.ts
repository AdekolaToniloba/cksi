// lib/constants/volunteer.ts
import { VolunteerCapacity } from "@/types/volunteer";

export const VOLUNTEER_CAPACITY_LABELS: Record<VolunteerCapacity, string> = {
  [VolunteerCapacity.TEACHING]: "Teaching & Tutoring",
  [VolunteerCapacity.HEALTHCARE]: "Healthcare & Medical",
  [VolunteerCapacity.MENTORSHIP]: "Mentorship & Counseling",
  [VolunteerCapacity.FUNDRAISING]: "Fundraising & Development",
  [VolunteerCapacity.EVENT_PLANNING]: "Event Planning & Coordination",
  [VolunteerCapacity.TECHNOLOGY]: "Technology & IT Support",
  [VolunteerCapacity.ADMINISTRATION]: "Administration & Office Support",
  [VolunteerCapacity.COMMUNITY_OUTREACH]: "Community Outreach",
  [VolunteerCapacity.SKILLED_LABOR]: "Skilled Labor & Construction",
  [VolunteerCapacity.OTHER]: "Other",
};

export const VOLUNTEER_CAPACITY_DESCRIPTIONS: Record<
  VolunteerCapacity,
  string
> = {
  [VolunteerCapacity.TEACHING]:
    "Help students with homework, teach subjects, or provide educational support",
  [VolunteerCapacity.HEALTHCARE]:
    "Provide medical assistance, health education, or support healthcare programs",
  [VolunteerCapacity.MENTORSHIP]:
    "Guide and counsel youth, provide career advice, or life skills training",
  [VolunteerCapacity.FUNDRAISING]:
    "Help with fundraising campaigns, donor relations, or grant writing",
  [VolunteerCapacity.EVENT_PLANNING]:
    "Organize and coordinate events, manage logistics, or support event execution",
  [VolunteerCapacity.TECHNOLOGY]:
    "Provide IT support, web development, software training, or technical assistance",
  [VolunteerCapacity.ADMINISTRATION]:
    "Help with office tasks, data entry, scheduling, or administrative support",
  [VolunteerCapacity.COMMUNITY_OUTREACH]:
    "Engage with communities, conduct awareness campaigns, or build partnerships",
  [VolunteerCapacity.SKILLED_LABOR]:
    "Assist with construction, repairs, facility improvements, or maintenance work",
  [VolunteerCapacity.OTHER]:
    "Have other skills or interests? Tell us how you'd like to help",
};

export const VOLUNTEER_STATUS_COLORS = {
  PENDING: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    border: "border-yellow-300",
  },
  REVIEWED: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-300",
  },
  APPROVED: {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-300",
  },
  CONTACTED: {
    bg: "bg-purple-100",
    text: "text-purple-800",
    border: "border-purple-300",
  },
  DECLINED: {
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-300",
  },
};

export const VOLUNTEER_FORM_LABELS = {
  name: "Full Name",
  email: "Email Address",
  phone: "Phone Number",
  state: "State",
  country: "Country",
  capacity: "How would you like to volunteer?",
  additionalHelp: "How else can you help?",
  receiveUpdates: "Receive CKSI updates and communications",
};

export const VOLUNTEER_FORM_PLACEHOLDERS = {
  name: "John Doe",
  email: "john@example.com",
  phone: "+234 800 000 0000",
  state: "Lagos",
  country: "Nigeria",
  additionalHelp:
    "Tell us about your skills, experience, and what you hope to contribute...",
};

export const VOLUNTEER_EMAIL_TEMPLATES = {
  CONFIRMATION: {
    subject: "Thank you for your volunteer application - CKSI",
    preview: "We've received your application and will be in touch soon",
  },
  APPROVED: {
    subject: "Your volunteer application has been approved! - CKSI",
    preview: "Welcome to the CKSI volunteer community",
  },
  CONTACTED: {
    subject: "Next steps for your CKSI volunteer journey",
    preview: "Let's discuss your volunteer opportunities",
  },
  DECLINED: {
    subject: "Update on your volunteer application - CKSI",
    preview: "Thank you for your interest in volunteering with CKSI",
  },
};
