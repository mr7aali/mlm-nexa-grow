export function getApiErrorMessage(error: unknown, fallback = "Request failed") {
  if (
    error &&
    typeof error === "object" &&
    "data" in error &&
    error.data &&
    typeof error.data === "object" &&
    "errors" in error.data &&
    Array.isArray(error.data.errors) &&
    error.data.errors.length
  ) {
    const validationMessages = error.data.errors
      .map(formatValidationError)
      .filter(Boolean);

    if (validationMessages.length) {
      return validationMessages.join(" ");
    }
  }

  if (
    error &&
    typeof error === "object" &&
    "data" in error &&
    error.data &&
    typeof error.data === "object" &&
    "message" in error.data &&
    typeof error.data.message === "string"
  ) {
    return error.data.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

function formatValidationError(error: unknown) {
  if (!error || typeof error !== "object") return "";

  const issue = error as {
    path?: unknown[];
    code?: string;
    minimum?: number;
    message?: string;
  };
  const field = typeof issue.path?.[0] === "string" ? issue.path[0] : "";
  const label = fieldLabels[field] ?? field;

  if (issue.code === "too_small" && typeof issue.minimum === "number") {
    return `${label} কমপক্ষে ${issue.minimum} অক্ষর/সংখ্যা হতে হবে।`;
  }

  if (issue.code === "invalid_format" || issue.code === "invalid_string") {
    return `${label} সঠিক ফরম্যাটে লিখুন।`;
  }

  if (issue.code === "invalid_type") {
    return `${label} সঠিকভাবে পূরণ করুন।`;
  }

  return label ? `${label}: ${issue.message ?? "সঠিকভাবে পূরণ করুন।"}` : issue.message ?? "";
}

const fieldLabels: Record<string, string> = {
  fullName: "পুরো নাম",
  customerName: "পুরো নাম",
  email: "ইমেইল",
  password: "পাসওয়ার্ড",
  phone: "মোবাইল নম্বর",
  address: "ডেলিভারি ঠিকানা",
  paymentMethod: "পেমেন্ট পদ্ধতি",
  referralCode: "রেফার কোড",
  quantity: "পরিমাণ",
  productId: "পণ্য",
};
