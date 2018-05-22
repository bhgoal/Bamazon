var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 8889,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  newAction();
});

function newAction() {
  inquirer.prompt([
      {
          type: "list",
          name: "action",
          message: "What do you want to do?",
          choices: ["View Products for Sale", "Quit"]
      }
  ]).then(function(user) {
      switch (user.action) {
          case "View Products for Sale":
              showProducts();
              break;
          case "Quit":
              process.exit();
      }
  });
}

function showProducts() {
    console.log("Displaying all products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        for (i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].item_id);
            console.log("Item: " + res[i].product_name);
            console.log("Price: " + res[i].price);  
            console.log("-------------------------------------------------");
        }

        inquirer.prompt([
            {
                type: "input",
                name: "buyWhich",
                message: "Please enter the ID of the item you wish to purchase:",
            },
            {
                type: "input",
                name: "buyQty",
                message: "Please enter the quantity you wish to purchase:",
            }
        ]).then(function(user) {
            var item = res[parseInt(user.buyWhich) - 1];
            var buyQuantity = parseInt(user.buyQty);
            if (buyQuantity <= item.stock_quantity) {
              connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                  {
                    stock_quantity: (item.stock_quantity - buyQuantity),
                    product_sales: (item.price * buyQuantity)
                  },
                  {
                    item_id: (user.buyWhich)
                  }
                ],
                function(err, res) {
                  console.log("Successfully purchased!");
                  console.log("Total cost: $" + (item.price * buyQuantity));
                  newAction();
                }
              );
              
            } else {
                console.log("Insufficient stock!");
                newAction();
            }
        });
    });
}

