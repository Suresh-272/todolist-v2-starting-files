//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/tolistDB');
    const itemsSchema = {
      name: String 
    };
    
    const Item = mongoose.model("Item", itemsSchema);
  
    const item1 = new Item({
      name: "Start Development "
    });
    const item2 = new Item({
      name: "Web Development "
    });
    const item3 = new Item({
      name: "App Development "
    });
  
    const defaultItems = [item1,item2,item3];
  
    // Item.insertMany(defaultItems);
    
  
    // const items = ["Buy Food", "Cook Food", "Eat Food"];
    // const workItems = [];
  
    app.get("/", function(req, res) {

        Item.find({function(foundItems, err){
            res.render("list", {listTitle: "Today", newListItems: foundItems});
          }});

    });

    app.post("/", function(req, res){

    const item = req.body.newItem;

    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
    });

    app.get("/work", function(req,res){
    res.render("list", {listTitle: "Work List", newListItems: workItems});
    });

    app.get("/about", function(req, res){
    res.render("about");
    });

    app.listen(3000, function() {
    console.log("Server started on port 3000");
    });

}
