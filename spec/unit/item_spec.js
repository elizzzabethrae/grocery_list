const sequelize = require("../../src/db/models/index").sequelize;
const List = require("../../src/db/models").List;
const Item = require("../../src/db/models").Item;

describe("item", () => {

  beforeEach((done) => {
    this.list;
    this.item;
    sequelize.sync({force: true}).then((res) => {
      List.create({
        title: "happy hour",
        description: "guests over on tuesday"
      })
      .then((list) => {
        this.list = list;
        Item.create({
          name: "vodka",
          bought: false,
          listId: this.list.id
        })
        .then((item) => {
          this.item = item;
          done();
        });
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

  });

  describe("#create()", () => {

     it("should create a new item with name and bought status", (done) => {
       Item.create({
         name: "soda water",
         bought: false,
         listId: this.list.id
       })
       .then((item) => {
         expect(item.name).toBe("soda water");
         expect(item.bought).toBe(false);
         done();

       })
       .catch((err) => {
         console.log(err);
         done();
       });
     });
   });

   it("should not create a item with missing name and bought status", (done) => {
     Item.create({
       name: "limes"
     })
     .then((item) => {

       done();
     })
     .catch((err) => {
       expect(err.message).toContain("Item.bought cannot be null");
       expect(err.message).toContain("Item.listId cannot be null");
       done();
     })
   });


   describe("#setList()", () => {

     it("should associate a List and an item together", (done) => {
       List.create({
         title: "breakfast",
         description: "fam is coming over for breakfast"
       })
       .then((newList) => {
         expect(this.item.listId).toBe(this.list.id);
         this.item.setList(newList)
         .then((item) => {
           expect(item.listId).toBe(newList.id);
           done();
         });
       })
     });
   });

   describe("#getList()", () => {

     it("should return the associated list", (done) => {
       this.item.getList()
       .then((associatedList) => {
         expect(associatedList.title).toBe("happy hour");
         done();
       });
     });
   });

});
