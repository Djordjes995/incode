function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateVerificationScore(): number {
  const shouldFail = Math.random() < 0.3;

  if (shouldFail) {
    return randomInt(0, 49);
  }

  return randomInt(50, 100);
}
