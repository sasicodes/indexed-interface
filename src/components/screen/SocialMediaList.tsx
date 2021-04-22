import { SOCIAL_MEDIA } from "config";
import { Space } from "antd";
import { Token } from "components/atomic";

export function SocialMediaList() {
  return (
    <Space
      direction="vertical"
      style={{
        position: "fixed",
        top: 75,
        left: 0,
        width: 45,
        background: "rgba(0, 0, 0, 0.65)",
        borderTop: "1px solid rgba(255, 255, 255, 0.65)",
        borderRight: "1px solid rgba(255, 255, 255, 0.65)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.65)",
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        justifyContent: "space-evenly",
        padding: "1rem 0.25rem",
      }}
    >
      {SOCIAL_MEDIA.map((site) => (
        <a
          key={site.name}
          href={site.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Token name={site.name} image={site.image} asAvatar={true} />
        </a>
      ))}
    </Space>
  );
}