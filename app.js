const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://admin-suresh:test123@cluster0.cntihcp.mongodb.net/todolistDB');
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

  const defaultItems = [item2,item3];

  const listSchema = {
    name: String,
    items: [itemsSchema]
  };
  const List = mongoose.model("List", listSchema);

  app.get("/", function(req, res) {

    // const perItem = Item.find({});
    // Item.find(function (err, fitem){
    //   if (err) {
    //     console.log(err);
    //   } else {
    //   console.log(albums);
      
    //   }
    // });

    Item.find({}).then(fitem => {
      if (fitem) {
        if(fitem.length === 0){
          Item.insertMany(defaultItems);
          res.redirect('/'); 
        }
        res.render("list", {listTitle: "Today", newListItems: fitem});
      }
    }).catch(err => {
      if (err) {
        console.log(err);
    }
    });


  });

  app.post("/", function(req, res){

    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
      name: itemName
    })

    if(listName === "Today"){
      item.save();
      res.redirect('/');
    } else {
      List.findOne({name: listName}).then(fList => {
        fList.items.push(item);
        fList.save();
        res.redirect("/"+ listName);
      })
    }

  });

  app.post("/delete", function(req,res){
    const checkedboxId = (req.body.checkbox );
    const listName = (req.body.listName );

    if(listName === "Today"){
      Item.findByIdAndRemove(checkedboxId).then(err => {
        if(!err){
          console.log("Checked item");
        }
        res.redirect("/");
      }).catch(err => {
        console.log("Error is ocrror");
      })
    } else {
      List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedboxId}}}).then(fList => {
        res.redirect('/'+ listName)
      }).catch(err => {
        if (err) {
          console.log(err);
      }
      });
    } 
    
  });

  app.get("/:cusListName", function(req,res){
    const cusListName =  _.capitalize(req.params.cusListName);

    List.findOne({name: cusListName}).then(fList => {
      if (!fList) {
        const list = new List({
          name: cusListName,
          items: defaultItems
        });
        list.save();
        res.redirect('/'+ cusListName);
      } 
    res.render("list", {listTitle: fList.name , newListItems: fList.items});

    }).catch(err => {
      if (err) {
        console.log(err);
    }
    })

  
  })

  app.get("/work", function(req,res){
    res.render("list", {listTitle: "Work List", newListItems: workItems});
  });

  app.get("/about", function(req, res){
    res.render("about");
  });

  app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port 3000");
  });
}
