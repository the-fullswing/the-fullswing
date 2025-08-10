import DefaultTheme from "vitepress/theme";
import PostHeader from "./components/PostHeader.vue";
import Comment from "./components/Comment.vue";
import Layout from "./Layout.vue";
import "./custom.css";

export default {
  ...DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component("PostHeader", PostHeader);
    app.component("Comment", Comment);
  },
};
