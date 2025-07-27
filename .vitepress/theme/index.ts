import DefaultTheme from "vitepress/theme";
import PostHeader from "./components/PostHeader.vue";
import "./custom.css";

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component("PostHeader", PostHeader);
  },
};
