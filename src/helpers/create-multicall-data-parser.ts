import {
  CallWithResult,
  RegisteredCall,
  deserializeOnChainCall,
} from "features/batcher/slice";
import { MulticallData } from "features/actions";

export type RelevantCall = [
  string /* poolAddress */,
  Record<string /* function name */, CallWithResult[]>
];

export default function createMulticallDataParser<T>(
  prefix: string,
  formatter: (calls: [string, Record<string, CallWithResult[]>][]) => T
) {
  return ({
    callers: { [prefix]: relevantCaller },
    callsToResults,
  }: MulticallData) => {
    if (relevantCaller) {
      const onChainCalls = relevantCaller.onChainCalls
        .map(deserializeOnChainCall)
        .filter((entry): entry is RegisteredCall => Boolean(entry))
        .reduce((prev, next, index) => {
          const serialized = relevantCaller.onChainCalls[index];

          if (!prev[next.target]) {
            prev[next.target] = {};
          }

          if (!prev[next.target][next.function]) {
            prev[next.target][next.function] = [];
          }

          prev[next.target][next.function].push({
            ...next,
            result: callsToResults[serialized],
          });

          return prev;
        }, {} as Record<string, Record<string, CallWithResult[]>>);
      const relevantCalls = Object.entries(
        onChainCalls
      ).filter((each): each is RelevantCall => Boolean(each));
      const formattedResults = formatter(relevantCalls);

      return formattedResults;
    }
  };
}
