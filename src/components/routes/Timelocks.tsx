import {
  CreateTimelockForm,
  TimelockCard,
  TimelockWithdrawalForm,
} from "components/dndx";
import { Page } from "components/atomic";
import { Space } from "antd";

export default function Timelocks() {
  return (
    <Page title="Timelocks" hasPageHeader={true}>
      <Space direction="vertical" size="large">
        <CreateTimelockForm />

        <Space align="start">
          <div style={{ marginRight: 18 }}>
            <TimelockWithdrawalForm isReady={true} />
          </div>
          <TimelockWithdrawalForm isReady={false} />
        </Space>
        <Space size="large" align="start">
          <TimelockCard
            dndxAmount={58.24}
            baseNdxAmount={14.56}
            duration={31104000}
            dividends={12.04}
            timeLeft={0}
            unlocksAt={1631303807596 / 1000}
          />
          <TimelockCard
            dndxAmount={58.24}
            baseNdxAmount={14.56}
            duration={31104000}
            dividends={12.04}
            timeLeft={1037000}
            unlocksAt={1631303807596 / 1000}
          />
        </Space>
      </Space>
    </Page>
  );
}
