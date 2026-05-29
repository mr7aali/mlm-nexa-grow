"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy } from "lucide-react";
import { Badge, Button, Card, CopyButton, Input } from "@/components/ui";
import { getApiErrorMessage } from "@/lib/api-error";
import { useChangePasswordMutation, useGetMeQuery, useUpdateProfileMutation } from "@/lib/api";
import { initials, referralLink } from "@/lib/utils";

const profileSchema = z.object({
  fullName: z.string().min(3, "Enter your full name"),
  phone: z.string().min(8, "Enter a valid phone number"),
});

const passwordSchema = z.object({
  current: z.string().min(6, "Enter your current password"),
  next: z.string().min(6, "Enter a new password"),
});

export default function ProfilePage() {
  const [message, setMessage] = useState("");
  const { data: me } = useGetMeQuery();
  const referralUrl = me ? referralLink(me.referralCode) : "";
  const [updateProfile, { isLoading: profileSaving }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: passwordSaving }] = useChangePasswordMutation();
  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: "", phone: "" },
  });
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    if (me) {
      profileForm.reset({ fullName: me.name, phone: me.phone });
    }
  }, [me, profileForm]);

  async function handleProfileSave(values: z.infer<typeof profileSchema>) {
    try {
      await updateProfile(values).unwrap();
      setMessage("Profile updated.");
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

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gold-light">Account settings</p>
        <h2 className="heading-gradient text-4xl font-black">Profile</h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="grid h-28 w-28 place-items-center rounded-full bg-gold text-4xl font-black text-white">
              {me ? initials(me.name) : "M"}
            </div>
            <h3 className="mt-4 text-2xl font-bold">{me?.name ?? "Member"}</h3>
            <Badge>Level {me?.level ?? 1}</Badge>
          </div>
          <div className="mt-6 space-y-3 rounded-[18px] border border-line bg-elevated p-4 text-sm">
            <p><span className="text-muted">Joined:</span> {me?.joined ?? "Loading..."}</p>
            <p><span className="text-muted">Referral code:</span> {me?.referralCode ?? "Loading..."}</p>
            <p><span className="text-muted">Status:</span> {me?.status ?? "Loading..."}</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-2xl font-bold">Edit profile</h3>
          <form className="space-y-4" onSubmit={profileForm.handleSubmit(handleProfileSave)}>
            <label className="block">
              <span className="mb-2 block text-sm text-muted">Full name</span>
              <Input {...profileForm.register("fullName")} />
              {profileForm.formState.errors.fullName ? <span className="text-sm text-gold">{profileForm.formState.errors.fullName.message}</span> : null}
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-muted">Phone</span>
              <Input {...profileForm.register("phone")} />
              {profileForm.formState.errors.phone ? <span className="text-sm text-gold">{profileForm.formState.errors.phone.message}</span> : null}
            </label>
            {message ? <p className="rounded-2xl bg-gold/10 px-4 py-3 text-sm text-gold">{message}</p> : null}
            <Button type="submit" disabled={profileSaving}>Save profile</Button>
          </form>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 text-2xl font-bold">Change password</h3>
          <form className="space-y-4" onSubmit={passwordForm.handleSubmit(handlePasswordSave)}>
            <Input type="password" {...passwordForm.register("current")} placeholder="Current password" />
            <Input type="password" {...passwordForm.register("next")} placeholder="New password" />
            <Button type="submit" variant="outline" disabled={passwordSaving}>Update password</Button>
          </form>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-2xl font-bold">My referral link</h3>
          <div className="break-all rounded-2xl border border-line bg-elevated p-4 text-sm text-gold-light">
            {referralUrl || "Referral link loading..."}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <CopyButton value={referralUrl} label="Copy link" />
            <Button
              type="button"
              variant="outline"
              onClick={() => referralUrl && navigator.clipboard?.writeText(referralUrl)}
            >
              <Copy size={16} /> Copy code
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
