export function normalizeName(name: string): string {
  return name.trim();
}

export function renderGreeting(name: string): string {
  return `Hello, ${normalizeName(name)}.`;
}
