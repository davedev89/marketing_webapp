export function formatMoney(value: number | string | null | undefined, currency = "USD", locale = "es-AR") {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatPercent(value: number | string | null | undefined, locale = "es-AR") {
  const amount = Number(value ?? 0) / 100;
  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 1
  }).format(amount);
}

export function formatDate(date: Date | string, locale = "es-AR") {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium"
  }).format(new Date(date));
}
