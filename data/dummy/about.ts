import type { LocalizedText } from "@/types/index.type";

export const aboutValueKeys = [
  { id: "integrity" as const, color: "text-accent" },
  { id: "quality" as const, color: "text-success" },
  { id: "customer" as const, color: "text-primary" },
  { id: "innovation" as const, color: "text-warning" },
];

export const aboutStats = [
  {
    id: "years" as const,
    value: "20+",
    label: {
      my: "နှစ်များ၏ အတွေ့အကြုံ",
      en: "Years Experience",
    } satisfies LocalizedText,
    color: "text-accent",
  },
  {
    id: "cities" as const,
    value: "50+",
    label: {
      my: "မြို့များ၌ ပို့ဆောင်သည်",
      en: "Cities Served",
    } satisfies LocalizedText,
    color: "text-success",
  },
  {
    id: "customers" as const,
    value: "10K+",
    label: {
      my: "ဝယ်ယူသူများ",
      en: "Happy Customers",
    } satisfies LocalizedText,
    color: "text-primary",
  },
  {
    id: "products" as const,
    value: "500+",
    label: {
      my: "ပစ္စည်းမျိုးများ",
      en: "Product Varieties",
    } satisfies LocalizedText,
    color: "text-warning",
  },
];

export const aboutTeamMembers = [
  {
    name: { my: "ဦးသန်းထွေး", en: "U Thant Twe" } satisfies LocalizedText,
    role: {
      my: "ဧရည်ဝန်ကြီး (CEO)",
      en: "Chief Executive Officer",
    } satisfies LocalizedText,
    bio: {
      my: "၂၅ နှစ်အထက်အကုန် အုပ်စနစ်စီးပွားရေး တ Industriese Assam trabajadores",
      en: "25+ years in automotive industry leadership",
    } satisfies LocalizedText,
  },
  {
    name: { my: "ဒေါ်စန္ဒာဝင်း", en: "Daw Sandar Win" } satisfies LocalizedText,
    role: {
      my: "မှူးချုပ်စီမံခန့်ခွဲရေး (COO)",
      en: "Chief Operating Officer",
    } satisfies LocalizedText,
    bio: {
      my: "စီမံခန့်ခွဲရေး နှင့် ဂျင်းစက်ရုံး ရicules المحور",
      en: "Operations & Supply Chain Management expert",
    } satisfies LocalizedText,
  },
  {
    name: { my: "ဦးကျော်ဇော", en: "U Kyaw Zaw" } satisfies LocalizedText,
    role: {
      my: "ဂျင်ရည်ရွယ်ချက်မှူးချုပ် (CTO)",
      en: "Chief Technical Officer",
    } satisfies LocalizedText,
    bio: {
      my: "အုပ်စနစ်အင်ဂျင်နီယာရ/schemas e cathedral",
      en: "Automotive Engineering specialist",
    } satisfies LocalizedText,
  },
];

export const aboutLocations = [
  {
    city: "Yangon",
    address: {
      my: "နှစ် ၁၂၃၊ အုပ်စနစ်လမ်းကြောင်း၊ ရန်ကုန်မြို့",
      en: "No. 123, Auto Parts Street, Yangon",
    } satisfies LocalizedText,
    phone: "+95 1 234 5678",
    hours: {
      my: "တနင်္လာ - သောကြာနေ့: ၉:၀၀ - ၆:၀၀",
      en: "Mon - Sat: 9:00 AM - 6:00 PM",
    } satisfies LocalizedText,
  },
  {
    city: "Mandalay",
    address: {
      my: "နှစ် ၄၅၆၊ မန္တလေးစျေးဝယ်ရုံ အပတ်မှာ",
      en: "No. 456, Mandalay Market Complex",
    } satisfies LocalizedText,
    phone: "+95 2 345 6789",
    hours: {
      my: "တနင်္လာ - သောကြာနေ့: ၉:၀၀ - ၆:၀၀",
      en: "Mon - Sat: 9:00 AM - 6:00 PM",
    } satisfies LocalizedText,
  },
];
