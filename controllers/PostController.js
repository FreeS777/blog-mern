import PostModel from "../models/Post.js";
import delPwdHash from "../utils/delPwdHash.js";

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Can't create post",
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").lean().exec();

    res.json(posts.map((post) => delPwdHash(post)));
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Can't get posts",
    });
  }
};

export const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { returnOriginal: false }
    )
      .populate("user")
      .lean()
      .exec();

    if (!post) {
      return res.status(404).json({
        message: "Can't find post",
      });
    }
    res.json(delPwdHash(post));
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Can't get post",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await PostModel.findOneAndDelete({
      _id: postId,
    });

    if (!post) {
      return res.status(404).json({
        message: "Can't find post",
      });
    }

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Can't delete post",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags,
        imageUrl: req.body.imageUrl,
        user: req.userId,
      }
    );

    if (!post) {
      return res.status(404).json({
        message: "Can't find post",
      });
    }

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Can't update post",
    });
  }
};
