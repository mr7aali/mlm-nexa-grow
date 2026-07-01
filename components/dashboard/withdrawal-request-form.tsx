"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { Button, Input, Select } from "@/components/ui";
import { useCreateWithdrawalMutation } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-error";
import type { PayoutDetails, WithdrawalMethod } from "@/lib/api-types";

const withdrawalMethods = ["bKash", "Nagad", "Rocket", "Bank", "Card"] as const;
const walletMethods: WithdrawalMethod[] = ["bKash", "Nagad", "Rocket"];

const optionalText = z.string().trim().optional();

const schema = z.object({
  amount: z.string().refine((value) => Number(value) > 0, "Enter a withdrawal amount"),
  method: z.enum(withdrawalMethods),
  payoutDetails: z.object({
    accountType: optionalText,
    accountName: optionalText,
    accountNumber: optionalText,
    phone: optionalText,
    bankName: optionalText,
    branchName: optionalText,
    routingNumber: optionalText,
    cardLast4: optionalText,
    note: optionalText,
  }),
}).superRefine((values, ctx) => {
  const details = values.payoutDetails;

  if (!details.accountName) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["payoutDetails", "accountName"],
      message: "Account holder name is required",
    });
  }

  if (walletMethods.includes(values.method)) {
    if (!details.accountType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["payoutDetails", "accountType"],
        message: "Account type is required",
      });
    }
    if (!details.phone || details.phone.replace(/\D/g, "").length < 11) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["payoutDetails", "phone"],
        message: "Enter a valid mobile wallet number",
      });
    }
  }

  if (values.method === "Bank") {
    [
      ["bankName", "Bank name is required"],
      ["branchName", "Branch name is required"],
      ["accountNumber", "Bank account number is required"],
      ["accountType", "Bank account type is required"],
    ].forEach(([field, message]) => {
      if (!details[field as keyof typeof details]) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["payoutDetails", field],
          message,
        });
      }
    });
  }

  if (values.method === "Card") {
    if (!details.accountType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["payoutDetails", "accountType"],
        message: "Card type is required",
      });
    }
    if (!details.cardLast4 || !/^\d{4}$/.test(details.cardLast4)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["payoutDetails", "cardLast4"],
        message: "Enter the last 4 card digits",
      });
    }
  }
});

type WithdrawalForm = z.infer<typeof schema>;

const defaultValues: WithdrawalForm = {
  amount: "",
  method: "bKash",
  payoutDetails: {
    accountType: "Personal",
    accountName: "",
    accountNumber: "",
    phone: "",
    bankName: "",
    branchName: "",
    routingNumber: "",
    cardLast4: "",
    note: "",
  },
};

function buildPayoutDetails(method: WithdrawalMethod, values: WithdrawalForm): PayoutDetails {
  const details = values.payoutDetails;

  if (method === "Bank") {
    return {
      provider: method,
      accountType: details.accountType,
      accountName: details.accountName,
      accountNumber: details.accountNumber,
      bankName: details.bankName,
      branchName: details.branchName,
      routingNumber: details.routingNumber,
      note: details.note,
    };
  }

  if (method === "Card") {
    return {
      provider: method,
      accountType: details.accountType,
      accountName: details.accountName,
      cardLast4: details.cardLast4,
      phone: details.phone,
      note: details.note,
    };
  }

  return {
    provider: method,
    accountType: details.accountType,
    accountName: details.accountName,
    phone: details.phone,
    note: details.note,
  };
}

function buildAccountSummary(details: PayoutDetails) {
  if (details.provider === "Bank") {
    return [details.bankName, details.branchName, details.accountName, details.accountNumber, details.accountType]
      .filter(Boolean)
      .join(" - ");
  }

  if (details.provider === "Card") {
    return [details.accountName, details.accountType, details.cardLast4 ? `Card ****${details.cardLast4}` : undefined]
      .filter(Boolean)
      .join(" - ");
  }

  return [details.accountName, details.phone, details.accountType].filter(Boolean).join(" - ");
}

function FieldError({ message }: { message?: string }) {
  return message ? <span className="text-sm text-gold">{message}</span> : null;
}

export function WithdrawalRequestForm() {
  const [message, setMessage] = useState("");
  const [createWithdrawal, { isLoading }] = useCreateWithdrawalMutation();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<WithdrawalForm>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const method = watch("method");
  const accountTypeOptions = useMemo(() => {
    if (method === "Bank") return ["Savings", "Current"];
    if (method === "Card") return ["Debit", "Credit"];
    return ["Personal", "Agent", "Merchant"];
  }, [method]);

  useEffect(() => {
    setValue("payoutDetails.accountType", accountTypeOptions[0], { shouldValidate: true });
  }, [accountTypeOptions, setValue]);

  async function handleWithdrawalSubmit(values: WithdrawalForm) {
    const amount = Number(values.amount);

    const payoutDetails = buildPayoutDetails(values.method, values);

    try {
      await createWithdrawal({
        amount,
        method: values.method,
        account: buildAccountSummary(payoutDetails),
        payoutDetails,
      }).unwrap();
      setMessage("Withdrawal request submitted.");
      reset(defaultValues);
    } catch (error) {
      setMessage(getApiErrorMessage(error, "Withdrawal request failed."));
    }
  }

  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-gold/10 text-gold-light">
          <Send size={20} />
        </span>
        <h3 className="text-2xl font-bold">Withdrawal request</h3>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(handleWithdrawalSubmit)}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-muted">Amount</span>
            <Input type="number" {...register("amount")} placeholder="Enter amount" />
            <FieldError message={errors.amount?.message} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-muted">Payment method</span>
            <Select {...register("method")}>
              {withdrawalMethods.map((item) => <option key={item}>{item}</option>)}
            </Select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm text-muted">Account holder name</span>
            <Input {...register("payoutDetails.accountName")} placeholder="Name used on the account" />
            <FieldError message={errors.payoutDetails?.accountName?.message} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-muted">Account type</span>
            <Select {...register("payoutDetails.accountType")}>
              {accountTypeOptions.map((item) => <option key={item}>{item}</option>)}
            </Select>
            <FieldError message={errors.payoutDetails?.accountType?.message} />
          </label>
        </div>

        {walletMethods.includes(method) ? (
          <label className="block">
            <span className="mb-2 block text-sm text-muted">{method} number</span>
            <Input {...register("payoutDetails.phone")} placeholder="01XXXXXXXXX" />
            <FieldError message={errors.payoutDetails?.phone?.message} />
          </label>
        ) : null}

        {method === "Bank" ? (
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm text-muted">Bank name</span>
              <Input {...register("payoutDetails.bankName")} placeholder="Bank name" />
              <FieldError message={errors.payoutDetails?.bankName?.message} />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-muted">Branch name</span>
              <Input {...register("payoutDetails.branchName")} placeholder="Branch name" />
              <FieldError message={errors.payoutDetails?.branchName?.message} />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-muted">Account number</span>
              <Input {...register("payoutDetails.accountNumber")} placeholder="Bank account number" />
              <FieldError message={errors.payoutDetails?.accountNumber?.message} />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-muted">Routing number</span>
              <Input {...register("payoutDetails.routingNumber")} placeholder="Optional" />
            </label>
          </div>
        ) : null}

        {method === "Card" ? (
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm text-muted">Card last 4 digits</span>
              <Input {...register("payoutDetails.cardLast4")} inputMode="numeric" maxLength={4} placeholder="1234" />
              <FieldError message={errors.payoutDetails?.cardLast4?.message} />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-muted">Phone number</span>
              <Input {...register("payoutDetails.phone")} placeholder="Optional" />
            </label>
          </div>
        ) : null}

        <label className="block">
          <span className="mb-2 block text-sm text-muted">Note</span>
          <Input {...register("payoutDetails.note")} placeholder="Optional payout instruction" />
        </label>

        {message ? <p className="rounded-2xl bg-gold/10 px-4 py-3 text-sm text-gold">{message}</p> : null}
        <Button className="w-full" type="submit" disabled={isLoading}>
          Submit request
        </Button>
      </form>
    </>
  );
}
