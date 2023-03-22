import styles from "./chatbot.module.scss";
import classNames from "classnames/bind";
import Sider from "antd/es/layout/Sider";
import { Avatar, Input, Layout, List, Menu } from "antd";
import { Content } from "antd/es/layout/layout";
import { FaLink, FaTelegramPlane } from "react-icons/fa";

const cx = classNames.bind(styles);

const friends = [
  {
    src: "https://fullstack.edu.vn/static/media/fallback-avatar.155cdb2376c5d99ea151.jpg",
    title: "Quan Le",
  },
  {
    src: "https://fullstack.edu.vn/static/media/fallback-avatar.155cdb2376c5d99ea151.jpg",
    title: "Hung Soi",
  },
  {
    src: "https://fullstack.edu.vn/static/media/fallback-avatar.155cdb2376c5d99ea151.jpg",
    title: "Bom",
  },
  {
    src: "https://fullstack.edu.vn/static/media/fallback-avatar.155cdb2376c5d99ea151.jpg",
    title: "Su",
  },
  {
    src: "https://fullstack.edu.vn/static/media/fallback-avatar.155cdb2376c5d99ea151.jpg",
    title: "Hung Dan",
  },
  {
    src: "https://fullstack.edu.vn/static/media/fallback-avatar.155cdb2376c5d99ea151.jpg",
    title: "Duy Tom",
  },

  {
    src: "https://fullstack.edu.vn/static/media/fallback-avatar.155cdb2376c5d99ea151.jpg",
    title: "Su",
  },
  {
    src: "https://fullstack.edu.vn/static/media/fallback-avatar.155cdb2376c5d99ea151.jpg",
    title: "Hung Dan",
  },
  {
    src: "https://fullstack.edu.vn/static/media/fallback-avatar.155cdb2376c5d99ea151.jpg",
    title: "Duy Tom",
  },

  {
    src: "https://fullstack.edu.vn/static/media/fallback-avatar.155cdb2376c5d99ea151.jpg",
    title: "Hung Dan",
  },
  {
    src: "https://fullstack.edu.vn/static/media/fallback-avatar.155cdb2376c5d99ea151.jpg",
    title: "Duy Tom",
  },
];

const messages = [
  {
    desc: "vcl luon dau cat moi",
    isMe: true,
  },
  {
    desc: "co le can 1 cai bau duoi",
    isMe: false,
  },
];

const ChatBot = () => {
  return (
    <div className={cx("chatbot")}>
      <Layout className={cx("chatbot__wrapper")}>
        <Sider collapsedWidth="0" width={320} className={cx("chatbot__sider")}>
          <div className={cx("chatbot__sider--top")}>
            <span className={cx("chatbot__sider--title")}>Chat</span>
            <Input.Search
              placeholder="Tìm kiếm bạn bè"
              style={{ marginBottom: 8 }}
              className={cx("chatbot__sider--search")}
            />
          </div>
          <List
            className={cx("chatbot__friends--list")}
            dataSource={friends}
            renderItem={(item) => (
              <List.Item className={cx("chatbot__friends--item")}>
                <List.Item.Meta
                  className={cx("chatbot__friends--item-meta")}
                  avatar={<Avatar src={item.src} />}
                  title={item.title}
                />
              </List.Item>
            )}
          />
        </Sider>
        <Content className={cx("chatbot__inner")}>
          <div className={cx("chatbot__msg--info")}>
            <img
              src="https://fullstack.edu.vn/static/media/fallback-avatar.155cdb2376c5d99ea151.jpg"
              alt="avatar"
              className={cx("chatbot__msg--info-img")}
            />
            <span className={cx("chatbot__msg--info-name")}>Quan Le</span>
          </div>
          <List
            className={cx("chatbot__msg--list")}
            dataSource={messages}
            renderItem={(message) => (
              <List.Item
                className={cx("chatbot__message", {
                  "chatbot__message--user": message.isMe === true,
                  "chatbot__message--bot": message.isMe === false,
                })}
              >
                <List.Item.Meta
                  // title={item.isMe ? null : item.name}
                  description={message.desc}
                />
              </List.Item>
            )}
            size="large"
            itemLayout="horizontal"
            style={{ overflow: "auto", height: "71vh" }}
          />
          <div className={cx("chatbot__msg--action")}>
            <FaLink className={cx("chatbot__msg--action-icon")} />
            <Input.TextArea
              className={cx("chatbot__msg--input")}
              rows={1}
              placeholder="Aa"
              autoSize={{ minRows: 1, maxRows: 5 }}
              // onPressEnter={handleSendMessage}
              // value={message}
              // onChange={handleChangeMessage}
            />
            <FaTelegramPlane className={cx("chatbot__msg--action-icon")} />
          </div>
        </Content>
      </Layout>
    </div>
  );
};

export default ChatBot;
