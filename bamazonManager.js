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
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"]
        }
    ]).then(function(user) {
        switch (user.action) {
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                viewLowInv();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addProduct();
                break;
            case "Quit":
                process.exit();
        }
    });
}

function viewProducts() {
    console.log("Showing all products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        for (i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].item_id);
            console.log("Item: " + res[i].product_name);
            console.log("Department: " + res[i].department_name);
            console.log("Price: " + res[i].price);  
            console.log("Stock Qty: " + res[i].stock_quantity);
            console.log("-------------------------------------------------");
        }
        newAction();
    });
}

function viewLowInv() {
    console.log("Showing products with quantity of 5 or less...\n");
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        for (i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].item_id);
            console.log("Item: " + res[i].product_name);
            console.log("Department: " + res[i].department_name);
            console.log("Price: " + res[i].price);  
            console.log("Stock Qty: " + res[i].stock_quantity);
            console.log("-------------------------------------------------");
        }
        newAction();
    });
}

function addInventory() {
    inquirer.prompt ([
        {
            type: "input",
            name: "updateWhich",
            message: "Enter the item ID of the item to be updated:"
        },
        {
            type: "input",
            name: "newQty",
            message: "Enter the new quantity of the item:"
        }
    ]).then(function(update) {
        connection.query(
            "UPDATE products SET ? WHERE ?",
            [
                {
                stock_quantity: (update.newQty)
                },
                {
                item_id: (update.updateWhich)
                }
            ],
            function(err, res) {
                console.log("Qty updated!\n");
                // Call deleteProduct AFTER the UPDATE completes
                newAction();
            }
        );
    });
}
  

function addProduct() {
    inquirer.prompt([
        {
            type: "input",
            name: "newName",
            message: "Enter the product name:",
        },
        {
            type: "input",
            name: "newDept",
            message: "Enter product department:",
        },
        {
            type: "input",
            name: "newPrice",
            message: "Enter the product price:",
        },
        {
            type: "input",
            name: "newStock",
            message: "Enter the product quantity:",
        }
    ]).then(function(user) {
        console.log("Inserting a new product...\n");
        var query = connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: user.newName,
                department_name: user.newDept,
                price: user.newPrice,
                stock_quantity: user.newStock
            },
                function(err, res) {
                console.log("Product inserted!\n");
                newAction();
            }
        );
    });  
}


