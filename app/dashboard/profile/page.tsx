"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { initials, taka, toBn } from "@/lib/utils";

const optionalText = z.string().max(600);
const genderOptions = ["Male", "Female", "Other"] as const;
const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

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

const emptyValue = "Not provided";

function formatDate(value?: string | null) {
  if (!value) return emptyValue;
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return value;

  return date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function DetailGrid({ items }: { items: DetailItem[] }) {
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
      { label: "ID Status", value: me?.status },
      { label: "User ID", value: me?.id },
      { label: "Name", value: me?.name },
      { label: "User", value: me?.role },
      { label: "Father", value: me?.fatherName },
      { label: "Mother", value: me?.motherName },
      { label: "Mobile", value: me?.phone },
      { label: "Address", value: me?.address },
      { label: "E-mail", value: me?.email },
      { label: "Date of Birth", value: formatDate(me?.dateOfBirth) },
      { label: "Religion", value: me?.religion },
      { label: "Gender", value: me?.gender },
      { label: "Blood Group", value: me?.bloodGroup },
      { label: "NID/BC", value: me?.nidOrBirthCertificate },
      { label: "Join Date", value: formatDate(me?.joined) },
      { label: "Refer to you", value: me?.referredByCode || "Direct member" },
    ],
    [me],
  );

  const nomineeItems = useMemo<DetailItem[]>(
    () => [
      { label: "Nominee Name", value: me?.nomineeName },
      { label: "Nominee Relation", value: me?.nomineeRelation },
      { label: "Nominee Address", value: me?.nomineeAddress },
      { label: "Nominee Village", value: me?.nomineeVillage },
      { label: "Nominee Post office", value: me?.nomineePostOffice },
      { label: "Nominee District", value: me?.nomineeDistrict },
    ],
    [me],
  );

  async function handleProfileSave(values: ProfileFormValues) {
    try {
      await updateProfile(values).unwrap();
      setMessage("Profile updated.");
      setEdit(false);
    } catch (error) {
      setMessage(getApiErrorMessage(error, "Profile update failed"));
    }
  }

  async function handlePasswordSave(values: z.infer<typeof passwordSchema>) {
    try {
      await changePassword(values).unwrap();
      passwordForm.reset();
      setMessage("Password updated.");
    } catch (error) {
      setMessage(getApiErrorMessage(error, "Password update failed"));
    }
  }

  async function handleReferralCopy(type: "code" | "link") {
    if (!referralCode) return;

    if (!navigator.clipboard) {
      setMessage("Clipboard is not available in this browser.");
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
      setMessage("Copy failed. Please try again.");
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
      setMessage("Profile picture updated.");
    } catch (error) {
      setMessage(getApiErrorMessage(error, "Profile picture upload failed"));
    } finally {
      if (profilePictureInputRef.current) {
        profilePictureInputRef.current.value = "";
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-gold-light">Member account</p>
        <h2 className="heading-gradient text-3xl font-black md:text-4xl">
          Profile
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
                      alt={me?.name ?? "Profile picture"}
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
                      {me ? initials(me.name) : "M"}
                    </div>
                  )}
                  {pictureUploading ? (
                    <div className="absolute inset-0 grid place-items-center rounded-full bg-foreground/35 backdrop-blur-[1px]">
                      <span
                        className="h-7 w-7 animate-spin rounded-full border-2 border-white/40 border-t-white"
                        aria-label="Uploading profile picture"
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
                    aria-label="Change profile picture"
                    title="Change profile picture"
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
                    {me?.name ?? "Member"}
                  </h3>
                  <div className="mt-2 flex min-h-7 flex-wrap gap-2">
                    <Badge>{me?.status ?? "Loading"}</Badge>
                    <Badge tone="muted">
                      {isMember
                        ? `Level ${toBn(me?.level ?? 1)}`
                        : (me?.role ?? "role")}
                    </Badge>
                  </div>
                  {pictureUploading ? (
                    <p className="mt-1 text-xs font-semibold text-gold-light">
                      Uploading profile picture...
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row md:items-center">
                {isMember ? (
                  <div className="min-h-20 rounded-lg border border-gold/20 bg-gold/10 px-4 py-3 md:min-w-52">
                    <div className="flex items-center gap-2 text-gold-light">
                      <WalletCards size={18} />
                      <p className="text-xs font-semibold">Current balance</p>
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
                        Management account
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
                  {edit ? "Close edit" : "Edit profile"}
                </Button>
              </div>
            </div>

            {me?.mission ? (
              <div className="mt-4 border-t border-line pt-4">
                <div className="flex items-center gap-2 text-gold-light">
                  <Target size={18} />
                  <p className="text-sm font-semibold">Mission</p>
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
                  <h3 className="text-xl font-bold md:text-2xl">User Data</h3>
                </div>
                <DetailGrid items={identityItems} />
              </section>

              <section className="rounded-lg border border-line p-4">
                <div className="mb-3 flex items-center gap-3">
                  <Users size={20} className="text-gold-light" />
                  <h3 className="text-xl font-bold md:text-2xl">Nominee</h3>
                </div>
                <DetailGrid items={nomineeItems} />
              </section>
            </div>
          ) : null}
        </div>
      </Card>


      {edit ? (
        <Card className="p-6">
          <div className="mb-5 flex items-center gap-3">
            <UserRound size={22} className="text-gold-light" />
            <h3 className="text-2xl font-bold">Edit Profile</h3>
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
              <Field label="Name">
                <Input {...profileForm.register("fullName")} />
              </Field>
              <Field label="Mobile">
                <Input {...profileForm.register("phone")} />
              </Field>
              <Field label="Father">
                <Input {...profileForm.register("fatherName")} />
              </Field>
              <Field label="Mother">
                <Input {...profileForm.register("motherName")} />
              </Field>
              <Field label="Date of Birth">
                <Input type="date" {...profileForm.register("dateOfBirth")} />
              </Field>
              <Field label="Religion">
                <Input {...profileForm.register("religion")} />
              </Field>
              <Field label="Gender">
                <Select {...profileForm.register("gender")}>
                  <option value="">Select gender</option>
                  {genderOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Blood Group">
                <Select {...profileForm.register("bloodGroup")}>
                  <option value="">Select blood group</option>
                  {bloodGroupOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="NID/BC">
                <Input {...profileForm.register("nidOrBirthCertificate")} />
              </Field>
              <Field label="Nominee Name">
                <Input {...profileForm.register("nomineeName")} />
              </Field>
              <Field label="Nominee Relation">
                <Input {...profileForm.register("nomineeRelation")} />
              </Field>
              <Field label="Nominee Village">
                <Input {...profileForm.register("nomineeVillage")} />
              </Field>
              <Field label="Nominee Post office">
                <Input {...profileForm.register("nomineePostOffice")} />
              </Field>
              <Field label="Nominee District">
                <Input {...profileForm.register("nomineeDistrict")} />
              </Field>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Field label="Address">
                <Textarea {...profileForm.register("address")} />
              </Field>
              <Field label="Nominee Address">
                <Textarea {...profileForm.register("nomineeAddress")} />
              </Field>
            </div>

            <div>
              <Field label="Mission">
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
                Save profile
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEdit(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 text-2xl font-bold">Change Password</h3>
          <form
            className="space-y-4"
            onSubmit={passwordForm.handleSubmit(handlePasswordSave)}
          >
            <Input
              type="password"
              {...passwordForm.register("current")}
              placeholder="Current password"
            />
            <Input
              type="password"
              {...passwordForm.register("next")}
              placeholder="New password"
            />
            <Button type="submit" variant="outline" disabled={passwordSaving}>
              Update password
            </Button>
          </form>
        </Card>

        {isMember ? (
          <Card className="p-6">
            <h3 className="mb-4 text-2xl font-bold">Referral Code</h3>
            <div className="break-all rounded-lg border border-line bg-elevated p-4 text-3xl font-black tracking-[0.18em] text-gold-light">
              {referralCode || "Loading..."}
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
                {copiedReferral === "code" ? "Code copied" : "Copy code"}
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
                {copiedReferral === "link" ? "Link copied" : "Copy referral"}
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
