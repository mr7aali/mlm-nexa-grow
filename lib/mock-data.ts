export type LevelStatus = "Locked" | "In Progress" | "Unlocked" | "Paid";

export const commissionLevels = [
  { level: 1, required: 6, earning: 200, current: 6, color: "emerald", status: "Paid" as LevelStatus },
  { level: 2, required: 36, earning: 600, current: 18, color: "sky", status: "In Progress" as LevelStatus },
  { level: 3, required: 216, earning: 2000, current: 42, color: "amber", status: "Locked" as LevelStatus },
  { level: 4, required: 1296, earning: 10000, current: 42, color: "rose", status: "Locked" as LevelStatus },
  { level: 5, required: 7776, earning: 50000, current: 42, color: "violet", status: "Locked" as LevelStatus },
  { level: 6, required: 46656, earning: 300000, current: 42, color: "gold", status: "Locked" as LevelStatus },
];

export const products = [
  { id: "health-kit", icon: "✦", name: "হেলথ গ্রো কিট", category: "স্বাস্থ্য", price: 1250, description: "দৈনন্দিন সুস্থতার জন্য ভিটামিন, হার্বাল টি ও নিউট্রিশন গাইড।", full: "স্বাস্থ্য সচেতন সদস্যদের জন্য তৈরি একটি সম্পূর্ণ ডেমো প্যাকেজ, যেখানে পণ্যের তথ্য, কমিশন ট্যাগ ও রেফার লিংক দেখানো হয়েছে।" },
  { id: "beauty-care", icon: "◆", name: "গোল্ড বিউটি কেয়ার", category: "বিউটি", price: 1850, description: "স্কিন কেয়ার রুটিন, সিরাম ও প্রিমিয়াম ক্রিম সেট।", full: "বিউটি ক্যাটাগরির mock product detail, referral-based product sharing UI প্রদর্শনের জন্য ব্যবহৃত।" },
  { id: "learn-pro", icon: "◈", name: "লার্নিং প্রো বান্ডেল", category: "ডিজিটাল", price: 990, description: "সেলস, নেটওয়ার্কিং ও অনলাইন আয়ের বাংলা কোর্স বান্ডেল।", full: "ডিজিটাল কোর্স পণ্যের ডেমো, যেখানে শেয়ারযোগ্য প্রোডাক্ট referral link তৈরি হয়।" },
  { id: "home-plus", icon: "⬢", name: "হোম প্লাস প্যাক", category: "লাইফস্টাইল", price: 2200, description: "গৃহস্থালি প্রয়োজনীয় পণ্যের curated demo package।", full: "লাইফস্টাইল পণ্য হিসেবে সাজানো frontend-only product modal ও share action দেখানোর জন্য।" },
];

export const users = [
  { id: "u1", name: "রাফি হাসান", email: "rafi@nexagrow.demo", phone: "০১৭১১-২২৩৩৪৪", level: 2, status: "Active", referralCode: "NXG-RAFI-2048", joined: "১২ জানুয়ারি ২০২৬", earned: 800, referrals: 18 },
  { id: "u2", name: "তানিয়া আক্তার", email: "tania@nexagrow.demo", phone: "০১৮২২-১১২২৩৩", level: 1, status: "Active", referralCode: "NXG-TANIA-102", joined: "১৮ জানুয়ারি ২০২৬", earned: 200, referrals: 7 },
  { id: "u3", name: "মাহিন রহমান", email: "mahin@nexagrow.demo", phone: "০১৯৩৩-৪৪৫৫৬৬", level: 2, status: "Active", referralCode: "NXG-MAHIN-310", joined: "২৫ জানুয়ারি ২০২৬", earned: 600, referrals: 16 },
  { id: "u4", name: "সাবিহা নূর", email: "sabiha@nexagrow.demo", phone: "০১৬৪৪-৯৯৮৮৭৭", level: 1, status: "Inactive", referralCode: "NXG-SABIHA-088", joined: "০২ ফেব্রুয়ারি ২০২৬", earned: 0, referrals: 4 },
  { id: "u5", name: "আরমান কবির", email: "arman@nexagrow.demo", phone: "০১৫৫৫-৭৭৬৬৫৫", level: 3, status: "Active", referralCode: "NXG-ARMAN-777", joined: "০৮ ফেব্রুয়ারি ২০২৬", earned: 2800, referrals: 48 },
  { id: "u6", name: "নাদিয়া ইসলাম", email: "nadia@nexagrow.demo", phone: "০১৩৬৬-১২১২১২", level: 1, status: "Banned", referralCode: "NXG-NADIA-501", joined: "১৫ ফেব্রুয়ারি ২০২৬", earned: 200, referrals: 6 },
];

export const referrals = Array.from({ length: 24 }, (_, index) => {
  const source = users[(index + 1) % users.length];
  return {
    id: `ref-${index + 1}`,
    name: `${source.name} ${index + 1}`,
    phone: source.phone,
    level: (index % 6) + 1,
    joinDate: `${String((index % 27) + 1).padStart(2, "0")} মার্চ ২০২৬`,
    referralCount: (index * 3) % 54,
    status: index % 5 === 0 ? "Inactive" : "Active",
    commissionEarned: index % 3 === 0 ? 200 : index % 4 === 0 ? 600 : 0,
    downline: 4 + index * 2,
  };
});

export const activities = referrals.slice(0, 10).map((item, index) => ({
  id: item.id,
  text: `${item.name} আপনার নেটওয়ার্কে যুক্ত হয়েছে`,
  time: `${index + 1} ঘণ্টা আগে`,
}));

export const commissionHistory = [
  { id: "c1", level: "লেভেল ১", date: "১৪ মার্চ ২০২৬", amount: 200, status: "Paid" },
  { id: "c2", level: "লেভেল ২", date: "অপেক্ষমান", amount: 600, status: "In Progress" },
  { id: "c3", level: "বোনাস ক্রেডিট", date: "২০ মার্চ ২০২৬", amount: 100, status: "Unlocked" },
];

export const withdrawals = [
  { id: "w1", date: "১২ মার্চ ২০২৬", amount: 500, method: "bKash", status: "Paid" },
  { id: "w2", date: "২৫ মার্চ ২০২৬", amount: 300, method: "Nagad", status: "Pending" },
  { id: "w3", date: "০৩ এপ্রিল ২০২৬", amount: 1200, method: "Bank", status: "Review" },
];

export const earningsByMonth = [
  { month: "জানু", income: 200, pending: 80 },
  { month: "ফেব", income: 450, pending: 120 },
  { month: "মার্চ", income: 800, pending: 220 },
  { month: "এপ্রিল", income: 1220, pending: 330 },
  { month: "মে", income: 1780, pending: 420 },
  { month: "জুন", income: 2400, pending: 520 },
];

export const notifications = [
  "নতুন ৩ জন সদস্য আজ যুক্ত হয়েছে",
  "লেভেল ২ আনলক হতে আর ১৮ আইডি দরকার",
  "উইথড্র অনুরোধ রিভিউতে আছে",
];

export type TreeNode = {
  id: string;
  name: string;
  level: number;
  joined: string;
  referrals: number;
  active: boolean;
  children?: TreeNode[];
};

export const referralTree: TreeNode = {
  id: "root",
  name: "রাফি হাসান",
  level: 0,
  joined: "১২ জানুয়ারি ২০২৬",
  referrals: 18,
  active: true,
  children: [
    {
      id: "l1-a",
      name: "তানিয়া আক্তার",
      level: 1,
      joined: "১৮ জানুয়ারি ২০২৬",
      referrals: 7,
      active: true,
      children: [
        { id: "l2-a", name: "ইমরান হোসেন", level: 2, joined: "০৩ ফেব্রুয়ারি ২০২৬", referrals: 3, active: true },
        { id: "l2-b", name: "নুসরাত জাহান", level: 2, joined: "০৬ ফেব্রুয়ারি ২০২৬", referrals: 4, active: false },
      ],
    },
    {
      id: "l1-b",
      name: "মাহিন রহমান",
      level: 1,
      joined: "২৫ জানুয়ারি ২০২৬",
      referrals: 16,
      active: true,
      children: [
        { id: "l2-c", name: "ফারহান আলী", level: 2, joined: "১১ ফেব্রুয়ারি ২০২৬", referrals: 8, active: true },
        {
          id: "l2-d",
          name: "মিতু সরকার",
          level: 2,
          joined: "১৮ ফেব্রুয়ারি ২০২৬",
          referrals: 5,
          active: true,
          children: [
            { id: "l3-a", name: "রুবেল মিয়া", level: 3, joined: "০১ মার্চ ২০২৬", referrals: 2, active: true },
            { id: "l3-b", name: "সুমাইয়া নূর", level: 3, joined: "০৪ মার্চ ২০২৬", referrals: 1, active: false },
          ],
        },
      ],
    },
  ],
};
