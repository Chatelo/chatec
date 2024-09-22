import { Prisma } from "@prisma/client";

export const { QueryMode } = Prisma;

export type Post = {
  id: number;
  title: string;
  content: string;
  slug: string;
  authorId: number;
  views: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  author: {
    id: number;
    name: string | null;
    email: string;
    isAdmin: boolean;
    password?: string;
  };
};

export type SessionUser = {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  isAdmin?: boolean;
};

export type Notification = {
  id: number;
  userId: number;
  message: string;
  createdAt: Date;
  read: boolean;
};

export type Affiliate = {
  id: number;
  userId: number;
  affiliateCode: string;
  referralLink: string;
  commissionRate: number;
  createdAt: Date;
  totalClicks: number;
  totalCommissions: number;
  user: Partial<User>;
  referrals: Referral[];
  commissions: Commission[];
  referralClicks: ReferralClick[];
};

export type User = {
  id: number;
  name: string | null;
  email: string;
  isAdmin: boolean;
  password: string;
  digitalAgreements: DigitalAgreement[];
  posts: Post[];
  affiliate: Affiliate | null;
  referredBy: Referral | null;
  agreementLinks: AgreementLink[];
  notifications: Notification[];
};

export type AgreementLink = {
  id: number;
  userId: number;
  link: string;
  isValid: boolean;
  createdAt: Date;
  expiresAt: Date;
  user?: User;
};

export type DigitalAgreement = {
  id: number;
  userId: number;
  agreementText: string;
  signature: string;
  agreedItems: string[];
  termsId: String;
  createdAt: Date;
  user?: User;
};

export type ReferralClick = {
  id: number;
  affiliateId: number;
  clickedAt: Date;
  affiliate?: Affiliate;
};

export type Referral = {
  id: number;
  affiliateId: number;
  referredUserId: number;
  status: string;
  createdAt: Date;
  completedAt: Date | null;
  affiliate?: Affiliate;
  referredUser?: User;
};

export type Commission = {
  id: number;
  affiliateId: number;
  amount: number;
  status: string;
  createdAt: Date;
  affiliate?: Affiliate;
};

export type Subscriber = {
  id: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};
