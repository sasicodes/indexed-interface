import { DataReceiverConfig, actions, selectors } from "features";
import { isEqual } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

export function useCallRegistrar(calls: DataReceiverConfig) {
  const dispatch = useDispatch();
  const [cachedCalls, setCachedCalls] = useState(calls);
  const isConnected = useSelector(selectors.selectConnected);

  // Effect:
  // Handle updates "gracefully" in a McJanky way.
  useEffect(() => {
    if (!isEqual(calls, cachedCalls)) {
      setCachedCalls(calls);
    }
  }, [calls, cachedCalls]);

  // Effect:
  // Register a multicall listener that queries certain functions every update.
  // Note: if the user is connected, defer all updates to the server.
  useEffect(() => {
    if (!isConnected && cachedCalls) {
      const allCalls = {
        caller: cachedCalls.caller,
        onChainCalls: cachedCalls.onChainCalls ?? [],
        offChainCalls: cachedCalls.offChainCalls ?? [],
      };

      dispatch(actions.callsRegistered(allCalls));

      return () => {
        dispatch(actions.callsUnregistered(allCalls));
      };
    }
  }, [dispatch, isConnected, cachedCalls]);
}
