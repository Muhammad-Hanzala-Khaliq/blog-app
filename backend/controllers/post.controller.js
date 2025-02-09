import ImageKit from "imagekit";
import postModel from "../models/post.model.js";
import userModel from "../models/user.model.js";

export const getPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;
  const query = {};
  const cat = req.query.cat;
  const author = req.query.author;
  const searchQuery = req.query.search;
  const sortQuery = req.query.sort;
  const featured = req.query.featured;

  if (cat) {
    query.category = cat;
  }

  if (searchQuery) {
    query.title = { $regex: searchQuery, $options: "i" };
  }
  if (author) {
    const user = await userModel.findOne({ username: author }).select("_id");

    if (!user) {
      return res.status(404).json("No Post Found");
    }

    query.user = user._id;
  }

  let sortObj  = {createdAt:-1}

  if (sortQuery) {
    switch (sortQuery) {
      case "newest":
         sortObj  = {createdAt:-1}
        break;

      case "oldest":
         sortObj  = {createdAt:1}
        break;
      case "popular":
         sortObj  = {visit:-1}
        break;
      case "trending":
         sortObj  = {createdAt:-1}
         query.createdAt ={
            $gte:new Date(new Date().getTime() - 7  * 24 * 60 * 60 * 1000)
         }
        break;

      default:
        break;
    }
  }

  if(featured){
    query.isFeatured = true
  }

  const posts = await postModel
    .find(query)
    .populate("user", "username")
    .sort(sortObj)
    .limit(limit)
    .skip((page - 1) * limit);
  const totalPost = await postModel.countDocuments();
  const hasMore = page * limit < totalPost;
  res.status(200).json({ posts, hasMore });
};
export const getPost = async (req, res) => {
  const post = await postModel
    .findOne({ slug: req.params.slug })
    .populate("user", "username img");
  res.status(200).json(post);
};
export const createPost = async (req, res) => {
  if (!req.auth || !req.auth.userId) {
    return res.status(401).json("Not authenticated!");
  }
  const clerkUserId = req.auth.userId;

  const user = await userModel.findOne({ clerkUserId });

  if (!user) {
    return res.status(404).json("User not found!");
  }

  let slug = req.body.title.replace(/ /g, "-").toLowerCase();
  let existingPost = await postModel.findOne({ slug });
  let counter = 2;
  while (existingPost) {
    slug = `${slug}-${counter}`;
    existingPost = await postModel.findOne({ slug });
    counter++;
  }

  const newPost = new postModel({ user: user._id, slug, ...req.body });

  const post = await newPost.save();
  res.status(200).json(post);
};
export const deletePost = async (req, res) => {
  const clerkUserId = req.auth.userId;
  if (!clerkUserId) {
    return res.status(401).json("not authenticated");
  }

  const role = req.auth.sessionClaims?.metadata?.role || "user";
  if (role === "admin") {
    await postModel.findByIdAndDelete(req.params.id);
    return res.status(200).json("post has been deleted");
  }

  const user = await userModel.findOne({ clerkUserId });
  const deletedPost = await postModel.findOneAndDelete({
    _id: req.params.id,
    user: user._id,
  });
  if (!deletedPost) {
    return res.status(403).json("u can deleted only uor post");
  }
  return res.status(200).json("post has been deleted");
};

export const featurePost = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const postId = req.body.postId;
  if (!clerkUserId) {
    return res.status(401).json("not authenticated");
  }

  const role = req.auth.sessionClaims?.metadata?.role || "user";
  if (role !== "admin") {
    return res.status(403).json("You cannot feature pOst");
  }

  const post = await postModel.findById(postId);
  if (!post) {
    return res.status(403).json("Post not found");
  }

  const isFeatured = post.isFeatured;

  const updatedPost = await postModel.findByIdAndUpdate(
    postId,
    { isFeatured: !isFeatured },
    { new: true }
  );
  return res.status(200).json(updatedPost);
};
const imagekit = new ImageKit({
  publicKey: "public_Hg6JEXv8S4NODg1M1Xq5Ngl7LlA=",
  privateKey: "private_ipgNX02P/gCoFSu13Shk9IxUUrs=",
  urlEndpoint: "https://ik.imagekit.io/n7zyemm7r3",
});

export const uploadAuth = async (req, res) => {
  var result = imagekit.getAuthenticationParameters();
  res.send(result);
};
