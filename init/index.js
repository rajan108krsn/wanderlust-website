const mongoose = require('mongoose');
const initData = require('./data');
const Listing = require('../models/listing');

const URL = 'mongodb://localhost:27017/airbnb';

main()
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(URL);
}

const initdb = async () => {
    await Listing.deleteMany({});
    const updatedData = initData.data.map((obj)=> ({...obj, owner: "67dd1a90445b9993ef921e55"}));
    await Listing.insertMany(updatedData);
    console.log('Data imported');
    mongoose.connection.close();
}

initdb().catch(err => console.log(err));