const mongoose=require('mongoose');
const fs=require('fs');
const tour=require('./models/model');
const users=require('./models/makeuser');
const reviews=require('./models/review');
const { json } = require('express');
mongoose.connect("mongodb://localhost:27017/shop", {useNewUrlParser: true}).then(con=>{
    console.log("yes you connected");
});
const file=JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours.json`,'utf-8'));
const review=JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/reviews.json`,'utf-8'));
const user=JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/users.json`,'utf-8'));

const createdb=async()=>{try{

await tour.create(file);
await users.create(user,{ validateBeforeSave: false });
await reviews.create(review);
console.log("data inserted succ");
process.exit();

}catch(err){
    console.log(err);
    console.log("some error occur in insertion");
}
}
const deletedb=async()=>{try{
    await tour.deleteMany();
    await users.deleteMany();
    await reviews.deleteMany();
    console.log("data deleted succ");
    process.exit();
    }catch(err){
        console.log("some error occur in deletion");
    }
    }
    if(process.argv[2]=='--delete'){
        deletedb();
        
    }
    if(process.argv[2]=='--insert'){
        createdb();
    }