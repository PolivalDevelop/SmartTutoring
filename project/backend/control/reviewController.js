const {postModel} = require('../models/lessonModel')
const {reviewModel} = require('../models/reviewModel')
const {userModel} = require('../models/userModel')
const mongoose = require('mongoose')

exports.createReview = async (req, res) => {
  const {buyer, seller, post, score, title, description} = req.body;
  try {
    const userBuyer = await userModel.findOne({username: buyer.username});
    if (!userBuyer) {
      return res.status(404).json({message: 'Buyer not found'});
    }

    const userSeller = await userModel.findOne({username: seller.username});
    if (!userSeller) {
      return res.status(404).json({message: 'Seller not found'});
    }

    if (userBuyer._id.equals(userSeller._id)) {
      return res.status(400).json({message: 'Buyer and seller cannot be the same user'});
    }

    const productPost = await postModel.findById(post);
    if (!productPost) {
      return res.status(404).json({message: 'Post not found'});
    }

    if (!productPost.seller.equals(userSeller._id)) {
      return res.status(400).json({message: 'Seller does not match the seller of the post'});
    }

    if (productPost.buyer && !productPost.buyer.equals(userBuyer._id)) {
      return res.status(400).json({message: 'Buyer does not match the buyer of the post'});
    }

    const existingReview = await reviewModel.findOne({
      buyer: userBuyer._id,
      seller: userSeller._id,
      post: productPost._id,
    });
    if (existingReview) {
      return res.status(400).json({message: 'Review already exists for this buyer, seller, and post'});
    }

    const newReview = new reviewModel({
      buyer: userBuyer._id,
      seller: userSeller._id,
      post: productPost._id,
      score,
      title,
      description,
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Error creating review', error});
  }
};

exports.getAllUserPostsWithReview = (req, res) => {
  const username = req.params.username;
  userModel.find({ username: username })
    .exec()
    .then(user => {
      if (user.length > 0) {
        const userId = user[0]._id;
        return reviewModel.find({ seller: userId }).exec();
      } else {
        res.status(404).json({ message: 'No user found' });
        throw new Error('No user'); // per interrompere la catena
      }
    })
    .then(reviews => {
      if (reviews && reviews.length > 0) {
        return postModel.find({ _id: { $in: reviews.map(review => review.post) } }).exec();
      } else {
        res.status(404).json({ message: 'No reviews found for this seller' });
        throw new Error('No reviews');
      }
    })
    .then(posts => {
      const formattedPosts = posts.map(post => {
        const formattedImages = post.images.map(image => ({
          data: image.data.toString('base64'),
          contentType: image.contentType
        }));
        return {
          ...post.toObject(),
          images: formattedImages
        };
      });
      res.status(200).json(formattedPosts);
    })
    .catch(err => {
      if (!res.headersSent) {
        res.status(500).json({ message: 'Error searching user reviews or posts' });
      }
      console.error(err);
    });
};


exports.getReviewByProductId = (req, res) => {
  let productId;
  try {
    productId = new mongoose.Types.ObjectId(req.params.id);
  } catch (err) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  reviewModel.find({ post: productId })
    .exec()
    .then(reviews => {
      if (reviews.length > 0) {
        res.status(200).json(reviews);
      } else {
        res.status(404).json({ message: 'No reviews found for this product' });
      }
    })
    .catch(err => {
      res.status(500).json({ message: 'Error searching product reviews' });
    });
};