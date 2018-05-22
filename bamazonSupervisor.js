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
            choices: ["View Product Sales by Department", "Create New Department", "Quit"]
        }
    ]).then(function(user) {
        switch (user.action) {
            case "View Product Sales by Department":
                viewSales();
                break;
            case "Create New Department":
                viewLowInv();
                break;
            case "Quit":
                process.exit();
        }
    });
}

const Table = require("cli-table");



function viewSales() {
    console.log("Showing all products...\n");
    connection.query("SELECT * FROM departments, products", function(err, res) {
        if (err) throw err;
        const table = new Table({
            head: ["Department ID", "Department Name", "Overhead Costs", "Product Sales", "Total Profit"]
        , colWidths: [15, 20, 15, 20, 20]
        });
        for (i = 0; i < res.length; i++) {
            
            table.push(
                [res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales, (res[i].product_sales - res[i].over_head_costs)]
            )
        }
        console.log(res);
        console.log(table.toString());
        newAction();
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

