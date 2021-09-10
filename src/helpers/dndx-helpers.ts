import { BigNumber, convert } from "helpers";
import { DEFAULT_DECIMAL_COUNT } from "config";

export type Amount = {
  exact: BigNumber;
  displayed: string;
};

export type DividendsLock = {
  id: string;
  owner: string;
  unlockAt: number;
  duration: number;
  amount: string;
};

export type FormattedDividendsLock = {
  id: string;
  owner: string;
  unlockAt: number;
  duration: number;
  timeRemaining: number;
  unlocked: boolean;
  amount: Amount;
  dividends: Amount;
  available: Amount; // Amount of NDX that could be withdrawn now
};

export const timestampNow = () => Math.floor(Date.now() / 1000);

export function formatAmount(
  exact: string | BigNumber,
  decimals: number = DEFAULT_DECIMAL_COUNT,
  precision?: number
): Amount {
  return {
    exact: convert.toBigNumber(exact),
    displayed: convert.toBalance(exact, decimals, false, precision),
  };
}

export function formatDividendsLock(
  lock: DividendsLock
): FormattedDividendsLock {
  const timestamp = Math.floor(Date.now() / 1000);
  const unlocked = timestamp >= lock.unlockAt;
  const timeRemaining = Math.max(0, timestamp - lock.unlockAt);
  const amount = formatAmount(lock.amount);
  const multiplier = calculateMultiplier(lock.duration);
  const dividends = formatAmount(amount.exact.times(multiplier.exact).div(one));
  const earlyWithdrawalFee: number | BigNumber = unlocked
    ? 0
    : calculateEarlyWithdrawalFee(amount.exact, lock.unlockAt, lock.duration)
        .exact;
  const available = formatAmount(amount.exact.minus(earlyWithdrawalFee));
  return {
    ...lock,
    timeRemaining,
    unlocked,
    amount,
    dividends,
    available,
  };
}

export const minLockDuration = 86400 * 90;
export const maxLockDuration = 86400 * 360;
export const durationRange = 86400 * 270;
export const minEarlyWithdrawalFee = convert.toToken("1", 17);
export const baseEarlyWithdrawalFee = convert.toToken("2", 17);
export const maxBonusMultiplier = convert.toToken("3");
export const one = convert.toToken("1");

export function calculateBonusMultiplier(duration: number) {
  const overMinimum = duration - minLockDuration;
  return formatAmount(maxBonusMultiplier.times(overMinimum).div(durationRange));
}

export function calculateMultiplier(duration: number) {
  const exact = one.plus(calculateBonusMultiplier(duration).exact);
  return formatAmount(exact);
}

export function calculateEarlyWithdrawalFee(
  amount: BigNumber,
  unlockAt: number,
  duration: number
) {
  const timeRemaining = unlockAt - timestampNow();
  const minimumFee = amount.times(minEarlyWithdrawalFee).div(one);
  const multiplier = calculateMultiplier(duration);
  const dynamicFee = amount
    .times(baseEarlyWithdrawalFee.times(timeRemaining).times(multiplier.exact))
    .div(convert.toToken("1", 36).times(duration));
  return formatAmount(minimumFee.plus(dynamicFee));
}