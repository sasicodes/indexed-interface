import { Alert, Button, Col, Descriptions, Row, Space, Statistic } from "antd";
import { AppState, FormattedPortfolioAsset, selectors } from "features";
import { ExternalLink, Page, TokenSelector } from "components/atomic";
import { Formik, useFormikContext } from "formik";
import { MASTER_CHEF_ADDRESS } from "config";
import { MasterChefPool } from "features/masterChef";
import {
  abbreviateAddress,
  convert,
  sushiswapAddLiquidityLink,
  sushiswapInfoPairLink,
} from "helpers";
import {
  useBalanceAndApprovalRegistrar,
  useMasterChefTransactionCallbacks,
  usePair,
  usePortfolioData,
  useTokenApproval,
  useTokenBalance,
} from "hooks";
import {
  useMasterChefRegistrar,
  useMasterChefRewardsPerDay,
} from "hooks/masterchef-hooks";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import BigNumber from "bignumber.js";

function StakingForm({
  token,
  stakingToken,
}: {
  token: FormattedPortfolioAsset;
  stakingToken: MasterChefPool;
}) {
  const { setFieldValue, values, errors } = useFormikContext<{
    amount: {
      displayed: string;
      exact: BigNumber;
    };
    inputType: "stake" | "unstake";
  }>();
  const { stake, withdraw } = useMasterChefTransactionCallbacks(
    stakingToken.id
  );
  const rewardsPerDay = useMasterChefRewardsPerDay(stakingToken.id);
  const [staked] = useMemo(() => {
    const staked = stakingToken.userStakedBalance;
    const earned = stakingToken.userEarnedRewards;

    return [staked, earned];
  }, [stakingToken]);
  const [estimatedReward, weight] = useMemo<[string, BigNumber]>(() => {
    const stakedAmount = convert.toBigNumber(staked ?? "0");
    const addAmount =
      values.inputType === "stake"
        ? values.amount.exact
        : values.amount.exact.negated();
    const userNewStaked = stakedAmount.plus(addAmount);
    if (userNewStaked.isLessThan(0)) {
      return ["0.00", convert.toBigNumber("0.00")];
    }
    const totalStaked = convert.toBigNumber(stakingToken.totalStaked);
    const newTotalStaked = totalStaked.plus(addAmount);
    const weight = userNewStaked.dividedBy(newTotalStaked);
    const dailyRewardsTotal = convert.toBalanceNumber(rewardsPerDay);
    const result = weight.multipliedBy(dailyRewardsTotal);

    return [convert.toComma(result.toNumber()), weight];
  }, [
    values.amount,
    stakingToken.totalStaked,
    rewardsPerDay,
    staked,
    values.inputType,
  ]);
  const handleSubmit = () => {
    (values.inputType === "stake" ? stake : withdraw)(
      values.amount.exact.toString()
    );
  };
  const balance = useTokenBalance(stakingToken.token);
  const { status, approve } = useTokenApproval({
    spender: MASTER_CHEF_ADDRESS,
    tokenId: stakingToken.token,
    amount: values.amount.displayed,
    rawAmount: values.amount.exact.toString(),
    symbol: token.symbol,
  });

  useBalanceAndApprovalRegistrar(MASTER_CHEF_ADDRESS, [stakingToken.token]);

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <TokenSelector
        assets={[]}
        value={{
          token: token.symbol,
          amount: values.amount,
        }}
        isInput={true}
        autoFocus
        balanceLabel={values.inputType === "unstake" ? "Staked" : undefined}
        balanceOverride={
          values.inputType === "unstake"
            ? {
                displayed: staked ?? "0.00",
                exact: convert.toBigNumber(staked ?? "0"),
              }
            : {
                displayed: balance ?? "0.00",
                exact: convert.toBigNumber(balance ?? "0"),
              }
        }
        selectable={false}
        onChange={(value) => setFieldValue("amount", value.amount)}
        error={errors.amount?.displayed}
      />
      <Alert
        type="warning"
        message={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Statistic
              title="Estimated Reward"
              value={`${estimatedReward} SUSHI / Day`}
            />
            <Statistic
              title="Pool Weight"
              value={convert.toPercent(weight.toNumber())}
              style={{ textAlign: "right" }}
            />
          </div>
        }
      />
      <Button.Group style={{ width: "100%" }}>
        {values.inputType === "stake" && status === "approval needed" ? (
          <Button
            type="primary"
            block={true}
            onClick={approve}
            disabled={!!errors.amount}
          >
            Approve
          </Button>
        ) : (
          <Button
            type="primary"
            danger={values.inputType === "unstake"}
            block={true}
            onClick={handleSubmit}
            disabled={!!errors.amount}
          >
            {values.inputType === "stake" ? "Deposit" : "Withdraw"}
          </Button>
        )}
        <Button
          type="primary"
          danger={values.inputType === "stake"}
          block={true}
          onClick={() =>
            setFieldValue(
              "inputType",
              values.inputType === "stake" ? "unstake" : "stake"
            )
          }
        >
          {values.inputType === "stake" ? "Withdraw" : "Deposit"}
        </Button>
      </Button.Group>
    </Space>
  );
}

function StakingStats({
  symbol,
  stakingToken,
}: {
  symbol: string;
  portfolioToken: FormattedPortfolioAsset;
  stakingToken: MasterChefPool;
}) {
  const [staked, earned] = useMemo(() => {
    let staked = stakingToken.userStakedBalance;
    let earned = stakingToken.userEarnedRewards;
    staked = staked ? convert.toBalance(staked, 18, false, 10) : "0";
    earned = earned ? convert.toBalance(earned, 18, false, 10) : "0";
    return [staked, earned];
  }, [stakingToken]);
  const rewardsPerDay = useMasterChefRewardsPerDay(stakingToken.id);

  const { exit, claim } = useMasterChefTransactionCallbacks(stakingToken.id);
  const pair = usePair(stakingToken.token);
  const url =
    pair && pair.token0 && pair.token1
      ? sushiswapAddLiquidityLink(pair.token0, pair.token1)
      : sushiswapInfoPairLink(stakingToken.token);

  return (
    <Descriptions bordered={true} column={1}>
      {/* Left Column */}
      {parseFloat(staked) > 0 && (
        <Descriptions.Item label="Staked">
          <Row>
            <Col xs={24} md={14}>
              {staked} {symbol}
            </Col>
            <Col xs={24} md={8}>
              <Button danger type="primary" block={true} onClick={exit}>
                Exit
              </Button>
            </Col>
          </Row>
        </Descriptions.Item>
      )}
      {parseFloat(earned) > 0 && (
        <Descriptions.Item label="Earned Rewards">
          <Row>
            <Col xs={24} md={14}>
              {earned} SUSHI
            </Col>
            <Col xs={24} md={8}>
              <Button type="primary" block={true} onClick={claim}>
                Claim
              </Button>
            </Col>
          </Row>
        </Descriptions.Item>
      )}

      <Descriptions.Item label="Reward Rate per Day">
        {`${convert.toBalance(rewardsPerDay, 18)} SUSHI`}
      </Descriptions.Item>

      <Descriptions.Item label="Rewards Pool">
        <ExternalLink
          to={`https://etherscan.io/address/${MASTER_CHEF_ADDRESS}`}
        >
          {abbreviateAddress(MASTER_CHEF_ADDRESS)}
        </ExternalLink>
      </Descriptions.Item>

      {/* Right Column */}
      <Descriptions.Item label="Total Staked">
        {convert.toBalance(stakingToken.totalStaked, 18, true)} {symbol}
      </Descriptions.Item>
      <Descriptions.Item label="Staking Token">
        <ExternalLink to={url}>{symbol}</ExternalLink>
      </Descriptions.Item>
    </Descriptions>
  );
}

export default function StakeMasterChef() {
  const { id } = useParams<{ id: string }>();

  useMasterChefRegistrar();
  const data = usePortfolioData({ onlyOwnedAssets: false });
  const toStake = useSelector((state: AppState) =>
    selectors.selectMasterChefPool(state, id)
  );
  const relevantPortfolioToken = useMemo(
    () =>
      toStake
        ? data.tokens.find(
            (token) =>
              token.address.toLowerCase() === toStake.token.toLowerCase()
          )
        : null,
    [data.tokens, toStake]
  );
  const balance = useTokenBalance(toStake?.token ?? "");

  if (!(toStake && relevantPortfolioToken)) {
    return null;
  }

  const stakingToken = relevantPortfolioToken.symbol;

  return (
    <Page hasPageHeader={true} title={`Stake ${stakingToken}`}>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <Row gutter={100}>
          <Col xs={24} md={10}>
            <Formik
              initialValues={{
                asset: "",
                amount: {
                  displayed: "0.00",
                  exact: convert.toBigNumber("0.00"),
                },
                inputType: "stake",
              }}
              onSubmit={console.info}
              validateOnChange={true}
              validateOnBlur={true}
              validate={(values) => {
                const errors: Record<string, string> = {};
                const maximum = parseFloat(
                  values.inputType === "stake"
                    ? balance
                    : convert.toBalance(toStake.userStakedBalance ?? "0")
                );

                if (values.amount.exact.isGreaterThan(maximum)) {
                  errors.amount = "Insufficient balance.";
                }

                return errors;
              }}
            >
              <StakingForm
                token={relevantPortfolioToken}
                stakingToken={toStake}
              />
            </Formik>
          </Col>
          <Col xs={24} md={14}>
            <StakingStats
              symbol={stakingToken}
              portfolioToken={relevantPortfolioToken}
              stakingToken={toStake}
            />
          </Col>
        </Row>
      </Space>
    </Page>
  );
}
