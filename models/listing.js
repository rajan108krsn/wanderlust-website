const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');  // Import Review model

const listingSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    image: {
        filename: { type: String, default: "defaultImage" },
        url: { 
            type: String,
            default: "https://img.freepik.com/free-vector/peacock-feather-shree-krishna-janmashtami-card-design_1035-27374.jpg?t=st=1740796182~exp=1740799782~hmac=aff7c7b13c61ed27bdeff9fd51564ce637dfaa2a642a7cafba8e57f5eccf8923&w=1480"
        }
    },    
    price: Number,
    location: String,
    country: String,
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true }
});

// Delete associated reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
