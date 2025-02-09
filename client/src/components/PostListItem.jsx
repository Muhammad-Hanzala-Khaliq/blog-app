import React from "react";
import Image from "./Image";
import { Link } from "react-router-dom";
import {format} from 'timeago.js'
import { LinkedinShareButton, LinkedinIcon } from "react-share";

const PostListItem = ({ post }) => {
  const postUrl = window.location.href; // Get the current URL of the blog post
  const postTitle = post.title; // Get the title of the blog post

  const postSummary = post.summary || "Check out this blog post!"; // Optional summary

  return (
    <div className="flex flex-col xl:flex-row gap-8 mb-12">
      {/* image */}
      {post.img && (
        <div className="md:hidden xl:block xl:w-1/3 ">
          <Image src={post.img} className="rounded-2xl object-cover" w="735" />
        </div>
      )}
      {/* details   */}
      <div className="flex flex-col gap-4 xl:w-2/3">
        <Link to={`/${post.slug}`} className="text-4xl font-semibold">
          {post.title}
        </Link>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span>Written by</span>
          <Link
            className="text-blue-800"
            to={`/posts?author=${post.user.username}`}
          >
            {post.user.username}
          </Link>
          <span>On</span>
          <Link className="text-blue-800">{post.category}</Link>
          <span>{format(post.createdAt)}</span>
        </div>
        <p>{post.desc}</p>
        <Link to={`/${post.slug}`} className="underline text-blue-800 text-sm">
          Read More
        </Link>
        <div className="flex gap-4">
          <p>Share this post on LinkedIn:</p>
          <LinkedinShareButton
            url={postUrl}
            title={postTitle}
            summary={postSummary}
          >
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>
        </div>
      </div>
    </div>
  );
};

export default PostListItem;