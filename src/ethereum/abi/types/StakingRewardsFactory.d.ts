/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface StakingRewardsFactoryInterface extends ethers.utils.Interface {
  functions: {
    "STAKING_REWARDS_IMPLEMENTATION_ID()": FunctionFragment;
    "computeStakingRewardsAddress(address)": FunctionFragment;
    "deployStakingRewardsForPool(address,uint88,uint256)": FunctionFragment;
    "deployStakingRewardsForPoolUniswapPair(address,uint88,uint256)": FunctionFragment;
    "getStakingRewards(address)": FunctionFragment;
    "getStakingTokens()": FunctionFragment;
    "increaseStakingRewards(address,uint88)": FunctionFragment;
    "notifyRewardAmount(address)": FunctionFragment;
    "notifyRewardAmounts()": FunctionFragment;
    "owner()": FunctionFragment;
    "poolFactory()": FunctionFragment;
    "proxyManager()": FunctionFragment;
    "recoverERC20(address,address)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "rewardsToken()": FunctionFragment;
    "setRewardsDuration(address,uint256)": FunctionFragment;
    "stakingRewardsGenesis()": FunctionFragment;
    "stakingRewardsInfoByStakingToken(address)": FunctionFragment;
    "stakingTokens(uint256)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "uniswapFactory()": FunctionFragment;
    "weth()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "STAKING_REWARDS_IMPLEMENTATION_ID",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "computeStakingRewardsAddress",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "deployStakingRewardsForPool",
    values: [string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "deployStakingRewardsForPoolUniswapPair",
    values: [string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getStakingRewards",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getStakingTokens",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "increaseStakingRewards",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "notifyRewardAmount",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "notifyRewardAmounts",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "poolFactory",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "proxyManager",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "recoverERC20",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardsToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setRewardsDuration",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "stakingRewardsGenesis",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "stakingRewardsInfoByStakingToken",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "stakingTokens",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "uniswapFactory",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "weth", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "STAKING_REWARDS_IMPLEMENTATION_ID",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "computeStakingRewardsAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "deployStakingRewardsForPool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "deployStakingRewardsForPoolUniswapPair",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getStakingRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getStakingTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "increaseStakingRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "notifyRewardAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "notifyRewardAmounts",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "poolFactory",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "proxyManager",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "recoverERC20",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardsToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setRewardsDuration",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "stakingRewardsGenesis",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "stakingRewardsInfoByStakingToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "stakingTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "uniswapFactory",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "weth", data: BytesLike): Result;

  events: {
    "IndexPoolStakingRewardsAdded(address,address)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "UniswapStakingRewardsAdded(address,address,address)": EventFragment;
  };

  getEvent(
    nameOrSignatureOrTopic: "IndexPoolStakingRewardsAdded"
  ): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "UniswapStakingRewardsAdded"): EventFragment;
}

export class StakingRewardsFactory extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: StakingRewardsFactoryInterface;

  functions: {
    STAKING_REWARDS_IMPLEMENTATION_ID(
      overrides?: CallOverrides
    ): Promise<[string]>;

    computeStakingRewardsAddress(
      stakingToken: string,
      overrides?: CallOverrides
    ): Promise<[string]>;

    deployStakingRewardsForPool(
      indexPool: string,
      rewardAmount: BigNumberish,
      rewardsDuration: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    deployStakingRewardsForPoolUniswapPair(
      indexPool: string,
      rewardAmount: BigNumberish,
      rewardsDuration: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getStakingRewards(
      stakingToken: string,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getStakingTokens(overrides?: CallOverrides): Promise<[string[]]>;

    increaseStakingRewards(
      stakingToken: string,
      rewardAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    notifyRewardAmount(
      stakingToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    notifyRewardAmounts(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    poolFactory(overrides?: CallOverrides): Promise<[string]>;

    proxyManager(overrides?: CallOverrides): Promise<[string]>;

    recoverERC20(
      stakingToken: string,
      tokenAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    rewardsToken(overrides?: CallOverrides): Promise<[string]>;

    setRewardsDuration(
      stakingToken: string,
      newDuration: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    stakingRewardsGenesis(overrides?: CallOverrides): Promise<[BigNumber]>;

    stakingRewardsInfoByStakingToken(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [number, string, BigNumber] & {
        tokenType: number;
        stakingRewards: string;
        rewardAmount: BigNumber;
      }
    >;

    stakingTokens(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    uniswapFactory(overrides?: CallOverrides): Promise<[string]>;

    weth(overrides?: CallOverrides): Promise<[string]>;
  };

  STAKING_REWARDS_IMPLEMENTATION_ID(overrides?: CallOverrides): Promise<string>;

  computeStakingRewardsAddress(
    stakingToken: string,
    overrides?: CallOverrides
  ): Promise<string>;

  deployStakingRewardsForPool(
    indexPool: string,
    rewardAmount: BigNumberish,
    rewardsDuration: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  deployStakingRewardsForPoolUniswapPair(
    indexPool: string,
    rewardAmount: BigNumberish,
    rewardsDuration: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getStakingRewards(
    stakingToken: string,
    overrides?: CallOverrides
  ): Promise<string>;

  getStakingTokens(overrides?: CallOverrides): Promise<string[]>;

  increaseStakingRewards(
    stakingToken: string,
    rewardAmount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  notifyRewardAmount(
    stakingToken: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  notifyRewardAmounts(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  poolFactory(overrides?: CallOverrides): Promise<string>;

  proxyManager(overrides?: CallOverrides): Promise<string>;

  recoverERC20(
    stakingToken: string,
    tokenAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  rewardsToken(overrides?: CallOverrides): Promise<string>;

  setRewardsDuration(
    stakingToken: string,
    newDuration: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  stakingRewardsGenesis(overrides?: CallOverrides): Promise<BigNumber>;

  stakingRewardsInfoByStakingToken(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<
    [number, string, BigNumber] & {
      tokenType: number;
      stakingRewards: string;
      rewardAmount: BigNumber;
    }
  >;

  stakingTokens(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  uniswapFactory(overrides?: CallOverrides): Promise<string>;

  weth(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    STAKING_REWARDS_IMPLEMENTATION_ID(
      overrides?: CallOverrides
    ): Promise<string>;

    computeStakingRewardsAddress(
      stakingToken: string,
      overrides?: CallOverrides
    ): Promise<string>;

    deployStakingRewardsForPool(
      indexPool: string,
      rewardAmount: BigNumberish,
      rewardsDuration: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    deployStakingRewardsForPoolUniswapPair(
      indexPool: string,
      rewardAmount: BigNumberish,
      rewardsDuration: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    getStakingRewards(
      stakingToken: string,
      overrides?: CallOverrides
    ): Promise<string>;

    getStakingTokens(overrides?: CallOverrides): Promise<string[]>;

    increaseStakingRewards(
      stakingToken: string,
      rewardAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    notifyRewardAmount(
      stakingToken: string,
      overrides?: CallOverrides
    ): Promise<void>;

    notifyRewardAmounts(overrides?: CallOverrides): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    poolFactory(overrides?: CallOverrides): Promise<string>;

    proxyManager(overrides?: CallOverrides): Promise<string>;

    recoverERC20(
      stakingToken: string,
      tokenAddress: string,
      overrides?: CallOverrides
    ): Promise<void>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    rewardsToken(overrides?: CallOverrides): Promise<string>;

    setRewardsDuration(
      stakingToken: string,
      newDuration: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    stakingRewardsGenesis(overrides?: CallOverrides): Promise<BigNumber>;

    stakingRewardsInfoByStakingToken(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [number, string, BigNumber] & {
        tokenType: number;
        stakingRewards: string;
        rewardAmount: BigNumber;
      }
    >;

    stakingTokens(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    uniswapFactory(overrides?: CallOverrides): Promise<string>;

    weth(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    IndexPoolStakingRewardsAdded(
      stakingToken?: null,
      stakingRewards?: null
    ): TypedEventFilter<
      [string, string],
      { stakingToken: string; stakingRewards: string }
    >;

    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;

    UniswapStakingRewardsAdded(
      indexPool?: null,
      stakingToken?: null,
      stakingRewards?: null
    ): TypedEventFilter<
      [string, string, string],
      { indexPool: string; stakingToken: string; stakingRewards: string }
    >;
  };

  estimateGas: {
    STAKING_REWARDS_IMPLEMENTATION_ID(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    computeStakingRewardsAddress(
      stakingToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    deployStakingRewardsForPool(
      indexPool: string,
      rewardAmount: BigNumberish,
      rewardsDuration: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    deployStakingRewardsForPoolUniswapPair(
      indexPool: string,
      rewardAmount: BigNumberish,
      rewardsDuration: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getStakingRewards(
      stakingToken: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getStakingTokens(overrides?: CallOverrides): Promise<BigNumber>;

    increaseStakingRewards(
      stakingToken: string,
      rewardAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    notifyRewardAmount(
      stakingToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    notifyRewardAmounts(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    poolFactory(overrides?: CallOverrides): Promise<BigNumber>;

    proxyManager(overrides?: CallOverrides): Promise<BigNumber>;

    recoverERC20(
      stakingToken: string,
      tokenAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    rewardsToken(overrides?: CallOverrides): Promise<BigNumber>;

    setRewardsDuration(
      stakingToken: string,
      newDuration: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    stakingRewardsGenesis(overrides?: CallOverrides): Promise<BigNumber>;

    stakingRewardsInfoByStakingToken(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    stakingTokens(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    uniswapFactory(overrides?: CallOverrides): Promise<BigNumber>;

    weth(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    STAKING_REWARDS_IMPLEMENTATION_ID(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    computeStakingRewardsAddress(
      stakingToken: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    deployStakingRewardsForPool(
      indexPool: string,
      rewardAmount: BigNumberish,
      rewardsDuration: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    deployStakingRewardsForPoolUniswapPair(
      indexPool: string,
      rewardAmount: BigNumberish,
      rewardsDuration: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getStakingRewards(
      stakingToken: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getStakingTokens(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    increaseStakingRewards(
      stakingToken: string,
      rewardAmount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    notifyRewardAmount(
      stakingToken: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    notifyRewardAmounts(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    poolFactory(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    proxyManager(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    recoverERC20(
      stakingToken: string,
      tokenAddress: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    rewardsToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setRewardsDuration(
      stakingToken: string,
      newDuration: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    stakingRewardsGenesis(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    stakingRewardsInfoByStakingToken(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    stakingTokens(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    uniswapFactory(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    weth(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}