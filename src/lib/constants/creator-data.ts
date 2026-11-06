export const CREATOR_TYPES = [
  "Solo Creator",
  "Agency / Team",
  "Brand Creator",
  "Hobbyist",
  "Educator",
] as const;

export const CHANNEL_NICHES = [
  "Tech & Coding",
  "Gaming",
  "Finance & Business",
  "Education & Science",
  "Lifestyle & Vlogs",
  "Entertainment",
  "Health & Fitness",
  "Music & Art",
  "News & Politics",
  "Travel & Adventure",
  "Food & Cooking",
  "Other",
] as const;

export const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "hi", name: "Hindi" },
  { code: "pt", name: "Portuguese" },
  { code: "de", name: "German" },
  { code: "fr", name: "French" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "id", name: "Indonesian" },
  { code: "ar", name: "Arabic" },
] as const;

export const TIMEZONES = [
  "UTC",
  "America/New_York (EST/EDT)",
  "America/Los_Angeles (PST/PDT)",
  "America/Chicago (CST/CDT)",
  "Europe/London (GMT/BST)",
  "Europe/Paris (CET/CEST)",
  "Europe/Berlin (CET/CEST)",
  "Asia/Kolkata (IST)",
  "Asia/Dubai (GST)",
  "Asia/Singapore (SGT)",
  "Asia/Tokyo (JST)",
  "Australia/Sydney (AEST/AEDT)",
] as const;
