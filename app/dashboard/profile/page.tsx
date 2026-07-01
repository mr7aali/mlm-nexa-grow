"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Camera,
  Check,
  Copy,
  IdCard,
  PencilLine,
  ShieldCheck,
  Target,
  UserRound,
  Users,
  WalletCards,
} from "lucide-react";
import { Badge, Button, Card, Input, Select, Textarea } from "@/components/ui";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  useChangePasswordMutation,
  useGetEarningsQuery,
  useGetMeQuery,
  useUpdateProfileMutation,
  useUploadProfilePictureMutation,
} from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { initials, taka, toBn } from "@/lib/utils";

const optionalText = z.string().max(600);
const religionOptions = [
  "Islam",
  "Hinduism",
  "Christianity",
  "Buddhism",
  "Other",
] as const;
const genderOptions = ["Male", "Female", "Other"] as const;
const bloodGroupOptions = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

const localizedOptions: Record<string, { bn: string; en: string }> = {
  Islam: { bn: "ইসলাম", en: "Islam" },
  Hinduism: { bn: "হিন্দু", en: "Hinduism" },
  Christianity: { bn: "খ্রিস্টান", en: "Christianity" },
  Buddhism: { bn: "বৌদ্ধ", en: "Buddhism" },
  Other: { bn: "অন্যান্য", en: "Other" },
  Male: { bn: "পুরুষ", en: "Male" },
  Female: { bn: "নারী", en: "Female" },
};

const profileText = {
  memberAccount: { bn: "সদস্য অ্যাকাউন্ট", en: "Member account" },
  profile: { bn: "প্রোফাইল", en: "Profile" },
  memberFallback: { bn: "সদস্য", en: "Member" },
  profilePicture: { bn: "প্রোফাইল ছবি", en: "Profile picture" },
  roleFallback: { bn: "রোল", en: "role" },
  loading: { bn: "লোড হচ্ছে...", en: "Loading..." },
  level: { bn: "লেভেল", en: "Level" },
  currentBalance: { bn: "বর্তমান ব্যালেন্স", en: "Current balance" },
  managementAccount: {
    bn: "ম্যানেজমেন্ট অ্যাকাউন্ট",
    en: "Management account",
  },
  uploadingProfilePicture: {
    bn: "প্রোফাইল ছবি আপলোড হচ্ছে...",
    en: "Uploading profile picture...",
  },
  changeProfilePicture: {
    bn: "প্রোফাইল ছবি পরিবর্তন করুন",
    en: "Change profile picture",
  },
  mission: { bn: "মিশন", en: "Mission" },
  userData: { bn: "ইউজার ডাটা", en: "User Data" },
  nominee: { bn: "নমিনি", en: "Nominee" },
  editProfile: { bn: "প্রোফাইল এডিট", en: "Edit Profile" },
  closeEdit: { bn: "এডিট বন্ধ", en: "Close edit" },
  saveProfile: { bn: "প্রোফাইল সেভ", en: "Save profile" },
  cancel: { bn: "বাতিল", en: "Cancel" },
  changePassword: { bn: "পাসওয়ার্ড পরিবর্তন", en: "Change Password" },
  currentPassword: { bn: "বর্তমান পাসওয়ার্ড", en: "Current password" },
  newPassword: { bn: "নতুন পাসওয়ার্ড", en: "New password" },
  updatePassword: { bn: "পাসওয়ার্ড আপডেট", en: "Update password" },
  referralCode: { bn: "রেফার কোড", en: "Referral Code" },
  copyCode: { bn: "কোড কপি", en: "Copy code" },
  codeCopied: { bn: "কোড কপি হয়েছে", en: "Code copied" },
  copyReferral: { bn: "রেফার লিংক কপি", en: "Copy referral" },
  linkCopied: { bn: "লিংক কপি হয়েছে", en: "Link copied" },
  directMember: { bn: "ডিরেক্ট সদস্য", en: "Direct member" },
  notProvided: { bn: "অনুগ্রহ করে তথ্য দিন", en: "Please provide this info" },
  selectReligion: { bn: "ধর্ম নির্বাচন করুন", en: "Select religion" },
  selectGender: { bn: "লিঙ্গ নির্বাচন করুন", en: "Select gender" },
  selectBloodGroup: {
    bn: "রক্তের গ্রুপ নির্বাচন করুন",
    en: "Select blood group",
  },
  profileUpdated: { bn: "প্রোফাইল আপডেট হয়েছে।", en: "Profile updated." },
  profileUpdateFailed: {
    bn: "প্রোফাইল আপডেট ব্যর্থ হয়েছে",
    en: "Profile update failed",
  },
  passwordUpdated: { bn: "পাসওয়ার্ড আপডেট হয়েছে।", en: "Password updated." },
  passwordUpdateFailed: {
    bn: "পাসওয়ার্ড আপডেট ব্যর্থ হয়েছে",
    en: "Password update failed",
  },
  clipboardUnavailable: {
    bn: "এই ব্রাউজারে ক্লিপবোর্ড ব্যবহার করা যাচ্ছে না।",
    en: "Clipboard is not available in this browser.",
  },
  copyFailed: {
    bn: "কপি ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
    en: "Copy failed. Please try again.",
  },
  profilePictureUpdated: {
    bn: "প্রোফাইল ছবি আপডেট হয়েছে।",
    en: "Profile picture updated.",
  },
  profilePictureUploadFailed: {
    bn: "প্রোফাইল ছবি আপলোড ব্যর্থ হয়েছে",
    en: "Profile picture upload failed",
  },
};

const profileLabels = {
  idStatus: { bn: "আইডি স্ট্যাটাস", en: "ID Status" },
  userId: { bn: "ইউজার আইডি", en: "User ID" },
  name: { bn: "নাম", en: "Name" },
  user: { bn: "ইউজার", en: "User" },
  father: { bn: "পিতা", en: "Father" },
  mother: { bn: "মাতা", en: "Mother" },
  mobile: { bn: "মোবাইল", en: "Mobile" },
  address: { bn: "ঠিকানা", en: "Address" },
  email: { bn: "ই-মেইল", en: "E-mail" },
  dateOfBirth: { bn: "জন্ম তারিখ", en: "Date of Birth" },
  religion: { bn: "ধর্ম", en: "Religion" },
  gender: { bn: "লিঙ্গ", en: "Gender" },
  bloodGroup: { bn: "রক্তের গ্রুপ", en: "Blood Group" },
  nidBc: { bn: "এনআইডি/জন্ম সনদ", en: "NID/BC" },
  joinDate: { bn: "যোগদানের তারিখ", en: "Join Date" },
  referToYou: { bn: "আপনাকে রেফার করেছে", en: "Refer to you" },
  nomineeName: { bn: "নমিনির নাম", en: "Nominee Name" },
  nomineeRelation: { bn: "নমিনির সম্পর্ক", en: "Nominee Relation" },
  nomineeAddress: { bn: "নমিনির ঠিকানা", en: "Nominee Address" },
  nomineeVillage: { bn: "নমিনির গ্রাম", en: "Nominee Village" },
  nomineePostOffice: { bn: "নমিনির পোস্ট অফিস", en: "Nominee Post office" },
  nomineeDistrict: { bn: "নমিনির জেলা", en: "Nominee District" },
};

const profileSchema = z.object({
  fullName: z.string().min(3, "Name is required"),
  phone: z.string().min(8, "Mobile number is required"),
  fatherName: optionalText,
  motherName: optionalText,
  address: optionalText,
  dateOfBirth: optionalText,
  religion: optionalText,
  gender: optionalText,
  bloodGroup: optionalText,
  nidOrBirthCertificate: optionalText,
  nomineeName: optionalText,
  nomineeRelation: optionalText,
  nomineeAddress: optionalText,
  nomineeVillage: optionalText,
  nomineePostOffice: optionalText,
  nomineeDistrict: optionalText,
  profilePicture: optionalText,
  profilePicturePublicId: optionalText,
  mission: optionalText,
});

const passwordSchema = z.object({
  current: z.string().min(6, "Current password is required"),
  next: z.string().min(6, "New password is required"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

type DetailItem = {
  label: string;
  value?: string | number | null;
};

type Language = "bn" | "en";

function localize(value: { bn: string; en: string }, language: Language) {
  return value[language];
}

function optionLabel(value: string, language: Language) {
  return localizedOptions[value]?.[language] ?? value;
}

function formatDate(value: string | null | undefined, language: Language) {
  if (!value) return "";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return value;

  return date.toLocaleDateString(language === "bn" ? "bn-BD" : "en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function DetailGrid({
  items,
  emptyValue,
}: {
  items: DetailItem[];
  emptyValue: string;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 2xl:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-md border border-line bg-elevated px-3 py-2.5"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
            {item.label}
          </p>
          <p className="mt-1 break-words text-sm font-bold text-foreground">
            {item.value || emptyValue}
          </p>
        </div>
      ))}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

export default function ProfilePage() {
  const { language } = useI18n();
  const t = useCallback(
    (value: { bn: string; en: string }) => localize(value, language),
    [language],
  );
  const [message, setMessage] = useState("");
  const [edit, setEdit] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState<"code" | "link" | null>(
    null,
  );
  const profilePictureInputRef = useRef<HTMLInputElement>(null);
  const { data: me } = useGetMeQuery();
  const { data: earnings } = useGetEarningsQuery(undefined, {
    skip: me?.role !== "member",
  });
  const isMember = me?.role === "member";
  const referralCode = me?.referralCode ?? "";
  const [updateProfile, { isLoading: profileSaving }] =
    useUpdateProfileMutation();
  const [uploadProfilePicture, { isLoading: pictureUploading }] =
    useUploadProfilePictureMutation();
  const [changePassword, { isLoading: passwordSaving }] =
    useChangePasswordMutation();
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      fatherName: "",
      motherName: "",
      address: "",
      dateOfBirth: "",
      religion: "",
      gender: "",
      bloodGroup: "",
      nidOrBirthCertificate: "",
      nomineeName: "",
      nomineeRelation: "",
      nomineeAddress: "",
      nomineeVillage: "",
      nomineePostOffice: "",
      nomineeDistrict: "",
      profilePicture: "",
      profilePicturePublicId: "",
      mission: "",
    },
  });
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
  });
  const profilePicturePreview = profileForm.watch("profilePicture");

  useEffect(() => {
    if (!me) return;

    profileForm.reset({
      fullName: me.name,
      phone: me.phone,
      fatherName: me.fatherName ?? "",
      motherName: me.motherName ?? "",
      address: me.address ?? "",
      dateOfBirth: me.dateOfBirth ?? "",
      religion: me.religion ?? "",
      gender: me.gender ?? "",
      bloodGroup: me.bloodGroup ?? "",
      nidOrBirthCertificate: me.nidOrBirthCertificate ?? "",
      nomineeName: me.nomineeName ?? "",
      nomineeRelation: me.nomineeRelation ?? "",
      nomineeAddress: me.nomineeAddress ?? "",
      nomineeVillage: me.nomineeVillage ?? "",
      nomineePostOffice: me.nomineePostOffice ?? "",
      nomineeDistrict: me.nomineeDistrict ?? "",
      profilePicture: me.profilePicture ?? "",
      profilePicturePublicId: me.profilePicturePublicId ?? "",
      mission: me.mission ?? "",
    });
  }, [me, profileForm]);

  const identityItems = useMemo<DetailItem[]>(
    () => [
      // { label: "ID Status", value: me?.status },
      // { label: "User ID", value: me?.id },
      // { label: t(profileLabels.name), value: me?.name },
      // { label: "User", value: me?.role },
      { label: t(profileLabels.father), value: me?.fatherName },
      { label: t(profileLabels.mother), value: me?.motherName },
      { label: t(profileLabels.mobile), value: me?.phone },
      { label: t(profileLabels.address), value: me?.address },
      { label: t(profileLabels.email), value: me?.email },
      {
        label: t(profileLabels.dateOfBirth),
        value: formatDate(me?.dateOfBirth, language),
      },
      {
        label: t(profileLabels.religion),
        value: me?.religion ? optionLabel(me.religion, language) : "",
      },
      {
        label: t(profileLabels.gender),
        value: me?.gender ? optionLabel(me.gender, language) : "",
      },
      { label: t(profileLabels.bloodGroup), value: me?.bloodGroup },
      { label: t(profileLabels.nidBc), value: me?.nidOrBirthCertificate },
      {
        label: t(profileLabels.joinDate),
        value: formatDate(me?.joined, language),
      },
      {
        label: t(profileLabels.referToYou),
        value: me?.referredByCode || t(profileText.directMember),
      },
    ],
    [language, me, t],
  );

  const nomineeItems = useMemo<DetailItem[]>(
    () => [
      { label: t(profileLabels.nomineeName), value: me?.nomineeName },
      { label: t(profileLabels.nomineeRelation), value: me?.nomineeRelation },
      { label: t(profileLabels.nomineeAddress), value: me?.nomineeAddress },
      { label: t(profileLabels.nomineeVillage), value: me?.nomineeVillage },
      {
        label: t(profileLabels.nomineePostOffice),
        value: me?.nomineePostOffice,
      },
      { label: t(profileLabels.nomineeDistrict), value: me?.nomineeDistrict },
    ],
    [me, t],
  );

  async function handleProfileSave(values: ProfileFormValues) {
    try {
      await updateProfile(values).unwrap();
      setMessage(t(profileText.profileUpdated));
      setEdit(false);
    } catch (error) {
      setMessage(getApiErrorMessage(error, t(profileText.profileUpdateFailed)));
    }
  }

  async function handlePasswordSave(values: z.infer<typeof passwordSchema>) {
    try {
      await changePassword(values).unwrap();
      passwordForm.reset();
      setMessage(t(profileText.passwordUpdated));
    } catch (error) {
      setMessage(
        getApiErrorMessage(error, t(profileText.passwordUpdateFailed)),
      );
    }
  }

  async function handleReferralCopy(type: "code" | "link") {
    if (!referralCode) return;

    if (!navigator.clipboard) {
      setMessage(t(profileText.clipboardUnavailable));
      return;
    }

    const value =
      type === "code"
        ? referralCode
        : `${window.location.origin}/products?ref=${encodeURIComponent(
            referralCode,
          )}`;

    try {
      await navigator.clipboard.writeText(value);
      setCopiedReferral(type);
      window.setTimeout(() => setCopiedReferral(null), 1800);
    } catch {
      setMessage(t(profileText.copyFailed));
    }
  }

  async function handleProfilePictureUpload(file?: File) {
    if (!file) return;

    try {
      const uploaded = await uploadProfilePicture(file).unwrap();
      const values = {
        ...profileForm.getValues(),
        profilePicture: uploaded.url,
        profilePicturePublicId: uploaded.publicId,
      };

      profileForm.setValue("profilePicture", uploaded.url, {
        shouldDirty: true,
        shouldValidate: true,
      });
      profileForm.setValue("profilePicturePublicId", uploaded.publicId, {
        shouldDirty: true,
        shouldValidate: true,
      });
      await updateProfile(values).unwrap();
      setMessage(t(profileText.profilePictureUpdated));
    } catch (error) {
      setMessage(
        getApiErrorMessage(error, t(profileText.profilePictureUploadFailed)),
      );
    } finally {
      if (profilePictureInputRef.current) {
        profilePictureInputRef.current.value = "";
      }
    }
  }

  return (
    <div className="space-y-6" data-no-translate>
      <div>
        <p className="text-sm font-semibold text-gold-light">
          {t(profileText.memberAccount)}
        </p>
        <h2 className="heading-gradient text-3xl font-black md:text-4xl">
          {t(profileText.profile)}
        </h2>
      </div>

      <Card className="p-4 md:p-6">
        <div className="space-y-5">
          <div className="rounded-lg border border-line bg-elevated p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <div className="relative h-20 w-20 shrink-0">
                  {profilePicturePreview || me?.profilePicture ? (
                    <Image
                      src={profilePicturePreview || me?.profilePicture || ""}
                      alt={me?.name ?? t(profileText.profilePicture)}
                      width={88}
                      height={88}
                      unoptimized
                      className={`h-20 w-20 rounded-full border border-gold/30 object-cover transition ${
                        pictureUploading ? "opacity-45" : "opacity-100"
                      }`}
                    />
                  ) : (
                    <div
                      className={`grid h-20 w-20 place-items-center rounded-full bg-gold text-3xl font-black text-white transition ${
                        pictureUploading ? "opacity-45" : "opacity-100"
                      }`}
                    >
                      {me
                        ? initials(me.name)
                        : t(profileText.memberFallback)[0]}
                    </div>
                  )}
                  {pictureUploading ? (
                    <div className="absolute inset-0 grid place-items-center rounded-full bg-foreground/35 backdrop-blur-[1px]">
                      <span
                        className="h-7 w-7 animate-spin rounded-full border-2 border-white/40 border-t-white"
                        aria-label={t(profileText.uploadingProfilePicture)}
                      />
                    </div>
                  ) : null}
                  <input
                    ref={profilePictureInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) =>
                      handleProfilePictureUpload(event.target.files?.[0])
                    }
                  />
                  <button
                    type="button"
                    disabled={pictureUploading}
                    onClick={() => profilePictureInputRef.current?.click()}
                    className="absolute bottom-0 right-0 grid h-8 w-8 place-items-center rounded-full border border-line bg-surface text-gold-light shadow-sm transition hover:border-gold disabled:cursor-wait disabled:opacity-80"
                    aria-label={t(profileText.changeProfilePicture)}
                    title={t(profileText.changeProfilePicture)}
                  >
                    {pictureUploading ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-gold-light/30 border-t-gold-light" />
                    ) : (
                      <Camera size={15} />
                    )}
                  </button>
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-2xl font-black">
                    {me?.name ?? t(profileText.memberFallback)}
                  </h3>
                  <div className="mt-2 flex min-h-7 flex-wrap gap-2">
                    <Badge>{me?.status ?? t(profileText.loading)}</Badge>
                    <Badge tone="muted">
                      {isMember
                        ? `${t(profileText.level)} ${
                            language === "bn"
                              ? toBn(me?.level ?? 1)
                              : (me?.level ?? 1)
                          }`
                        : (me?.role ?? t(profileText.roleFallback))}
                    </Badge>
                  </div>
                  {pictureUploading ? (
                    <p className="mt-1 text-xs font-semibold text-gold-light">
                      {t(profileText.uploadingProfilePicture)}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row md:items-center">
                {isMember ? (
                  <div className="min-h-20 rounded-lg border border-gold/20 bg-gold/10 px-4 py-3 md:min-w-52">
                    <div className="flex items-center gap-2 text-gold-light">
                      <WalletCards size={18} />
                      <p className="text-xs font-semibold">
                        {t(profileText.currentBalance)}
                      </p>
                    </div>
                    <p className="mt-1 text-2xl font-black text-gold-light">
                      {taka(earnings?.balance ?? 0)}
                    </p>
                  </div>
                ) : (
                  <div className="flex min-h-20 items-center rounded-lg border border-gold/20 bg-gold/10 px-4 py-3 md:min-w-52">
                    <div className="flex items-center gap-2 text-gold-light">
                      <ShieldCheck size={18} />
                      <p className="text-xs font-semibold">
                        {t(profileText.managementAccount)}
                      </p>
                    </div>
                  </div>
                )}
                <Button
                  type="button"
                  variant={edit ? "outline" : "primary"}
                  className="min-h-11 min-w-36 justify-center whitespace-nowrap"
                  onClick={() => setEdit((value) => !value)}
                >
                  <PencilLine size={16} />
                  {edit ? t(profileText.closeEdit) : t(profileText.editProfile)}
                </Button>
              </div>
            </div>

            {me?.mission ? (
              <div className="mt-4 border-t border-line pt-4">
                <div className="flex items-center gap-2 text-gold-light">
                  <Target size={18} />
                  <p className="text-sm font-semibold">
                    {t(profileText.mission)}
                  </p>
                </div>
                <p className="mt-1 text-sm leading-6 text-foreground">
                  {me.mission}
                </p>
              </div>
            ) : null}
          </div>

          {!edit ? (
            <div className="space-y-5">
              <section className="rounded-lg border border-line p-4">
                <div className="mb-3 flex items-center gap-3">
                  <IdCard size={20} className="text-gold-light" />
                  <h3 className="text-xl font-bold md:text-2xl">
                    {t(profileText.userData)}
                  </h3>
                </div>
                <DetailGrid
                  items={identityItems}
                  emptyValue={t(profileText.notProvided)}
                />
              </section>

              <section className="rounded-lg border border-line p-4">
                <div className="mb-3 flex items-center gap-3">
                  <Users size={20} className="text-gold-light" />
                  <h3 className="text-xl font-bold md:text-2xl">
                    {t(profileText.nominee)}
                  </h3>
                </div>
                <DetailGrid
                  items={nomineeItems}
                  emptyValue={t(profileText.notProvided)}
                />
              </section>
            </div>
          ) : null}
        </div>
      </Card>

      {edit ? (
        <Card className="p-6">
          <div className="mb-5 flex items-center gap-3">
            <UserRound size={22} className="text-gold-light" />
            <h3 className="text-2xl font-bold">{t(profileText.editProfile)}</h3>
          </div>
          <form
            className="space-y-6"
            onSubmit={profileForm.handleSubmit(handleProfileSave)}
          >
            <input type="hidden" {...profileForm.register("profilePicture")} />
            <input
              type="hidden"
              {...profileForm.register("profilePicturePublicId")}
            />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <Field label={t(profileLabels.name)}>
                <Input {...profileForm.register("fullName")} />
              </Field>
              <Field label={t(profileLabels.mobile)}>
                <Input {...profileForm.register("phone")} />
              </Field>
              <Field label={t(profileLabels.father)}>
                <Input {...profileForm.register("fatherName")} />
              </Field>
              <Field label={t(profileLabels.mother)}>
                <Input {...profileForm.register("motherName")} />
              </Field>
              <Field label={t(profileLabels.dateOfBirth)}>
                <Input type="date" {...profileForm.register("dateOfBirth")} />
              </Field>
              <Field label={t(profileLabels.religion)}>
                <Select {...profileForm.register("religion")}>
                  <option value="">{t(profileText.selectReligion)}</option>
                  {religionOptions.map((option) => (
                    <option key={option} value={option}>
                      {optionLabel(option, language)}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label={t(profileLabels.gender)}>
                <Select {...profileForm.register("gender")}>
                  <option value="">{t(profileText.selectGender)}</option>
                  {genderOptions.map((option) => (
                    <option key={option} value={option}>
                      {optionLabel(option, language)}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label={t(profileLabels.bloodGroup)}>
                <Select {...profileForm.register("bloodGroup")}>
                  <option value="">{t(profileText.selectBloodGroup)}</option>
                  {bloodGroupOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label={t(profileLabels.nidBc)}>
                <Input {...profileForm.register("nidOrBirthCertificate")} />
              </Field>
              <Field label={t(profileLabels.nomineeName)}>
                <Input {...profileForm.register("nomineeName")} />
              </Field>
              <Field label={t(profileLabels.nomineeRelation)}>
                <Input {...profileForm.register("nomineeRelation")} />
              </Field>
              <Field label={t(profileLabels.nomineeVillage)}>
                <Input {...profileForm.register("nomineeVillage")} />
              </Field>
              <Field label={t(profileLabels.nomineePostOffice)}>
                <Input {...profileForm.register("nomineePostOffice")} />
              </Field>
              <Field label={t(profileLabels.nomineeDistrict)}>
                <Input {...profileForm.register("nomineeDistrict")} />
              </Field>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Field label={t(profileLabels.address)}>
                <Textarea {...profileForm.register("address")} />
              </Field>
              <Field label={t(profileLabels.nomineeAddress)}>
                <Textarea {...profileForm.register("nomineeAddress")} />
              </Field>
            </div>

            <div>
              <Field label={t(profileText.mission)}>
                <Textarea {...profileForm.register("mission")} />
              </Field>
            </div>

            {profileForm.formState.errors.fullName ? (
              <p className="text-sm text-gold">
                {profileForm.formState.errors.fullName.message}
              </p>
            ) : null}
            {profileForm.formState.errors.phone ? (
              <p className="text-sm text-gold">
                {profileForm.formState.errors.phone.message}
              </p>
            ) : null}
            {message ? (
              <p className="rounded-lg bg-gold/10 px-4 py-3 text-sm text-gold">
                {message}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={profileSaving}>
                {t(profileText.saveProfile)}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEdit(false)}
              >
                {t(profileText.cancel)}
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 text-2xl font-bold">
            {t(profileText.changePassword)}
          </h3>
          <form
            className="space-y-4"
            onSubmit={passwordForm.handleSubmit(handlePasswordSave)}
          >
            <Input
              type="password"
              {...passwordForm.register("current")}
              placeholder={t(profileText.currentPassword)}
            />
            <Input
              type="password"
              {...passwordForm.register("next")}
              placeholder={t(profileText.newPassword)}
            />
            <Button type="submit" variant="outline" disabled={passwordSaving}>
              {t(profileText.updatePassword)}
            </Button>
          </form>
        </Card>

        {isMember ? (
          <Card className="p-6">
            <h3 className="mb-4 text-2xl font-bold">
              {t(profileText.referralCode)}
            </h3>
            <div className="break-all rounded-lg border border-line bg-elevated p-4 text-3xl font-black tracking-[0.18em] text-gold-light">
              {referralCode || t(profileText.loading)}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                className="min-w-36"
                disabled={!referralCode}
                onClick={() => handleReferralCopy("code")}
              >
                {copiedReferral === "code" ? (
                  <Check size={16} />
                ) : (
                  <Copy size={16} />
                )}
                {copiedReferral === "code"
                  ? t(profileText.codeCopied)
                  : t(profileText.copyCode)}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="min-w-36"
                disabled={!referralCode}
                onClick={() => handleReferralCopy("link")}
              >
                {copiedReferral === "link" ? (
                  <Check size={16} />
                ) : (
                  <Copy size={16} />
                )}
                {copiedReferral === "link"
                  ? t(profileText.linkCopied)
                  : t(profileText.copyReferral)}
              </Button>
            </div>
            {/* <p
              className="mt-3 min-h-5 text-sm font-semibold text-gold-light"
              aria-live="polite"
            >
              {copiedReferral === "code"
                ? "Referral code copied."
                : copiedReferral === "link"
                  ? "Referral link copied."
                  : ""}
            </p> */}
          </Card>
        ) : null}
      </div>
    </div>
  );
}
