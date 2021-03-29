import { Menu, Space } from "antd";
import { TranslatedTerm, useTranslation } from "i18n";

const USEFUL_LINKS: Array<{
  text: TranslatedTerm;
  image: string;
  makeLink(address: string): string;
}> = [
  {
    text: "VIEW_ON_ETHERSCAN",
    image: require("assets/images/etherscan-link.png").default,
    makeLink: (address) =>
      `https://etherscan.io/address/${address.toLowerCase()}#code`,
  },
  {
    text: "TRADE_WITH_UNISWAP",
    image: require("assets/images/uniswap-link.png").default,
    makeLink: (address) =>
      `https://info.uniswap.org/token/${address.toLowerCase()}`,
  },
];

export default function UsefulLinks({ address }: { address: string }) {
  const translate = useTranslation();

  return (
    <Menu mode="horizontal" selectable={false}>
      {USEFUL_LINKS.map(({ text, image, makeLink }) => (
        <Menu.Item>
          <Space>
            <a
              key={image}
              href={makeLink(address)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                alt="..."
                src={image}
                style={{
                  width: 24,
                  height: 24,
                  marginRight: 12,
                  position: "relative",
                  top: -2,
                }}
              />
              <span>{translate(text)}</span>
            </a>
          </Space>
        </Menu.Item>
      ))}
    </Menu>
  );
}