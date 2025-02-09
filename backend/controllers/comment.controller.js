import CommentModel from '../models/comment.model.js'
import User from '../models/user.model.js'

export const getPostComments = async(req,res) =>{
    const comments = await CommentModel.find({post:req.params.postId}).populate("user","username img").sort({createdAt:-1})
    res.json(comments)
}
export const addComments = async(req,res) =>{
const clerkUserId = req.auth.userId;
const postId = req.params.postId;
if(!clerkUserId){
    return res.status(401).json("not authenticated")
}

const user = await User.findOne({clerkUserId})
const newComments = new CommentModel({
    ...req.body,user:user._id,post:postId
});

const savedComment = await newComments.save();
setTimeout(()=>{
    res.status(201).json(savedComment) 
},3000)

}
export const deleteComments = async(req,res) =>{
    const clerkUserId = req.auth.userId;
    const id = req.params.id;
    if(!clerkUserId){
        return res.status(401).json("not authenticated")
    }
     const role = req.auth.sessionClaims?.metadata?.role || "user"
       if(role === "admin"){
          await CommentModel.findByIdAndDelete(req.params.id)
      return res.status(200).json("Comment has been deleted")
    
       }
    
    const user = await User.findOne({clerkUserId});

    const deletedComment = await CommentModel.findOneAndDelete({_id:id,user:user._id});

    if(!deletedComment){
        return res.status(403).json('u can delete only your comment')
    }

    res.status(200).json('comment deleted')
}