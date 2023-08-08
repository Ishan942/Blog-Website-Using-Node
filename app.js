//jshint esversion:6

import express from "express";
// import axios from "axios";
import lodash from "lodash";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

async function startServer() {
  await mongoose.connect("mongodb://127.0.0.1:27017/postDB");
  console.log("Connected to MongoDB");
  const app = express();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static("public"));

  const PostSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    body: String,
  });

  const PostModel = mongoose.model("post", PostSchema);

  const post1 = new PostModel({
    title: "Post 1",
    body: "This is post 1",
  });

  const post2 = new PostModel({
    title: "Post 2",
    body: "This is post 2",
  });

  const post3 = new PostModel({
    title: "Post 3",
    body: "This is post 3",
  });
  const defaultArr = [post1, post2, post3];

  app.get("/", async (req, res) => {
    const posts = await PostModel.find();
    if (posts.length === 0) {
      await PostModel.insertMany(defaultArr);
      res.redirect("/");
    } else {
      res.render("home.ejs", {
        content: homeStartingContent,
        post_array: posts,
      });
    }
  });

  app.get("/about", (req, res) => {
    res.render("about.ejs", {
      content: aboutContent,
    });
  });

  app.get("/contact", (req, res) => {
    res.render("contact.ejs", {
      content: contactContent,
    });
  });

  app.get("/compose", (req, res) => {
    res.render("compose.ejs");
  });
  app.get("/post/:id", async (req, res) => {
    const post = await PostModel.findOne({
      title: req.params.id,
    });
    // posts.forEach((post) => {
    //   if (lodash.lowerCase(post.title) === lodash.lowerCase(req.params.id)) {
    //     res.render("post.ejs", { post: post });
    //   }
    // });

    if (post) {
      res.render("post.ejs", { post: post });
    } else {
      res.redirect("/");
    }
  });

  app.post("/compose", async (req, res) => {
    const new_post = new PostModel({
      title: req.body.title,
      body: req.body.body,
    });
    await new_post.save();
    res.redirect("/");
  });

  app.listen(3000, function () {
    console.log("Server started on port 3000");
  });
}

startServer();
