import "../layouts/footer.css";
import { Layout } from "antd";
const { Header } = Layout;
const header = () => {
  return (
    <Header
      style={{
        background: "transparent",
        height: 90,
        display: "flex",
        justifyContent: "center",
        marginLeft: "0%",
      }}
    >
      <img src="/logo.png" alt="logo" height={90} width={90} />
    </Header>
  );
};

export default header;
