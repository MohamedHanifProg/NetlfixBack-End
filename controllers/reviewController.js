const postReview = (req, res) => {
    const review = req.body;
    console.log('Received review:', review);
    res.status(201).json({ message: 'Review submitted successfully!' });
  };
  
  module.exports = { postReview };
  