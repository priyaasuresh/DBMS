const express = require("express");
const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");

const { Pool, Client } = require('pg')
let pool;
const ejs = require("ejs");
const app = express()
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'));


app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/login.html");
});


app.post("/",async(req,res)=>{
    nm = req.body.loginid;
    psd = req.body.loginpassword;
    try{
        pool =  new Pool({
            user: nm,
            password: psd,
            host: "localhost",
            port: "5432",
            database: "dbms_404_407_448"
        });


        pool.connect((err) => {
            if (err) {
                res.render("error");
            }else
            {
                if(nm == "admin_shamitha")
                {
                    res.redirect("/admin");
                }
                else if(nm == "admin_priya")
                {
                    res.redirect("/admin");
                }
                else
                {
                    res.redirect("/customer");
                }
            }
        })


    }catch(err)
    {
        console.log("error occuerd")
        console.log(err);
    }
});


// -------------------------------------PRODUCTS_Admin--------------------------------------

app.get("/product_admin",async(req,res)=>{

    q1 = "select * from products";
    try{

        r = await pool.query(q1);
        
        const arr = []
        for (var i=0; i<r.rows.length;i++)
        {
            arr.push(r.rows[i]);
        }
        res.render("product_admin",{arr:arr});
    }catch(err){
        console.log(err);
    }

});


app.post("/product_admin",async(req,res)=>{
    q2 = "select * from products";
    q3 = "insert into products(product_id, description, product_cost, brand, admin_id) values ($1,$2,$3,$4,$5) ";
    try
    {
        r = await pool.query(q2);
        var mx =0;
        for(var i=0; i< r.rows.length ;i++)
        {
            mx = Math.max(mx,r.rows[i].product_id);
        }
        product_id = mx+1;
        description = req.body.description;
        product_cost = parseFloat(req.body.product_cost);
        brand = req.body.brand;
        admin_id = req.body.admin_id;
        data = [product_id,description,product_cost,brand,admin_id];
        
        r3 = await pool.query(q3,data,(err)=>{
            if(err)
            {
                res.render("error_for_wrong_query_admin");
            }
        });
        //res.redirect("/product_admin");

    }catch(err)
    {
        console.log(err);
        res.json(err);
    }
})

// -------------------------------------PRODUCTS_Admin--------------------------------------



// -------------------------------------PRODUCTS--------------------------------------

let check_description = "";
let check_brand = "";
let check_product_cost = 0;

app.get("/product",async(req,res)=>{

    q1 = "select product_id, description, brand, product_cost from products";
    try{

        r = await pool.query(q1);
        
        const arr = []
        for (var i=0; i<r.rows.length;i++)
        {
            arr.push(r.rows[i]);
        }
        res.render("product",{arr:arr, product_id: check_product_id, description:check_description, brand:check_brand, product_cost:check_product_cost});
    }catch(err){
        console.log(err);
    }

});

app.post("/product", async(req,res)=>{
    if(req.body.product_id)
    {
        
        check_product_id = req.body.product_id;
        //console.log(check_product_id);
        q1 = `select product_id, description, brand, product_cost from products where (product_id = ${check_product_id})`;
        try {
            r1 = await pool.query(q1);
            if (r1.rows.length > 0) {
                check_product_id = r1.rows[0].product_id;
                check_description = r1.rows[0].description;
                check_brand = r1.rows[0].brand;
                check_product_cost = r1.rows[0].product_cost;
                res.redirect("/product");
            } else {
                check_product_id = 0;
                check_description = "";
                check_brand = "";
                check_product_cost = 0;
                console.log("error1");
                res.render("error_for_wrong_query");
            }


        } catch (err) {
            res.render("error_for_wrong_query");
            console.log("error2");
        }
    }
});

// -------------------------------------PRODUCTS--------------------------------------



// --------------------------Customer_Admin-----------------------------


let check_customer_id = 0;
let check_name = ""
let check_email = "";
let check_contact = 0;

app.get("/customer_admin",async(req,res)=>{
    q1 = "select customer_id,name,email,contact from customer";
    
    
    try{

            r1 =await pool.query(q1);
            const arr = []
            for(var i =0;i<r1.rows.length;i++)
            {
                arr.push(r1.rows[i]);
            }
            res.render("customer_admin",{arr:arr, customer_id: check_customer_id, name: check_name, email:check_email, contact:check_contact});
    }catch(err)
    {
        console.log(err);
        res.json(err);
    }

});

app.post("/customer_admin", async(req,res)=>{
    if(req.body.name)
    {
        
        check_name = req.body.name;
        //console.log(check_product_id);
        q2 = `select customer_id, name, email, contact from customer where (name = '${check_name}')`;
        //console.log(q2);
        try {
            r1 = await pool.query(q2);
            if (r1.rows.length > 0) {
                console.log(r1.rows[0].name);
                check_customer_id = r1.rows[0].customer_id;
                check_name = r1.rows[0].name;
                check_email = r1.rows[0].email;
                check_contact = r1.rows[0].contact;
                res.redirect("/customer_admin");
            } else {
                check_customer_id = 0;
                check_name = "";
                check_email = "";
                check_contact = 0;
                console.log("error1");
                res.render("error_for_wrong_query_admin");
            }


        } catch (err) {
            res.render("error_for_wrong_query_admin");
            console.log(err);
        }
    }
});

// -------------------------------------Customer_Admin--------------------------------------


// ------------------------------------Feedback_admin--------------------------------------

app.get("/feedback_admin",async(req,res)=>{

    q1 = "select * from feedback";
    try{

        r = await pool.query(q1);
        
        const arr = []
        for (var i=0; i<r.rows.length;i++)
        {
            arr.push(r.rows[i]);
        }
        res.render("feedback_admin",{arr:arr});
    }catch(err){
        console.log(err);
    }

});

// ------------------------------------Feedback_admin--------------------------------------



// ------------------------------------Feedback--------------------------------------

let check_feedback_id = 0;
let check_feedback_description = "";
let check_rating = 0;
//let check_product_id = 0;
//let check_array = [];

app.get("/feedback",async(req,res)=>{

    q1 = "select * from feedback";
    try{

        r = await pool.query(q1);
        
        const arr = []
        for (var i=0; i<r.rows.length;i++)
        {
            arr.push(r.rows[i]);
        }
        res.render("feedback",{arr:arr, feedback_id: check_feedback_id, feedback_description: check_feedback_description, rating: check_rating, product_id: check_product_id});

    }catch(err){
        console.log("error1");
    }
});


app.post("/feedback",async(req,res)=>{

    if(req.body.product_id)
    {
        
        check_product_id = req.body.product_id;
        //console.log(check_product_id);
        q1 = `select feedback_id, feedback_description, rating, product_id from feedback where (product_id = ${check_product_id})`;
        try {
            r1 = await pool.query(q1);
            if (r1.rows.length > 0) {
                check_feedback_id = r1.rows[0].feedback_id;
                check_feedback_description = r1.rows[0].feedback_description;
                check_rating = r1.rows[0].rating;
                check_product_id = r1.rows[0].product_id;
                console.log("error2");
                res.redirect("/feedback");
            } 
            else {
                console.log("error3");
                check_feedback_id = 0;
                check_feedback_description = "";
                check_rating = 0;
                check_product_id = 0;
                res.render("error_for_wrong_query");
            }

        } catch (err) {
            res.render("error_for_wrong_query");
            console.log("error4");
        }
    }

    q2 = "select feedback_id, feedback_description, rating, product_id from feedback";
    q3 = "insert into feedback(feedback_id, feedback_description, rating, product_id) values ($1,$2,$3,$4) ";

    try
    {
        r = await pool.query(q2);
        var mx =0;
        for(var i=0; i< r.rows.length ;i++)
        {
            mx = Math.max(mx,r.rows[i].feedback_id);
        }
        feedback_id = mx+1;
        feedback_description = req.body.feedback_description;
        rating = parseFloat(req.body.rating);
        product_id = req.body.product_id;
        data = [feedback_id, feedback_description, rating, product_id];
        
        r3 = await pool.query(q3,data,(err)=>{
            if(err)
            {
                res.render("error_for_wrong_query");
            }
        });

    }catch(err)
    {
        if (err) {
            //console.log("error2");
            res.render("error_for_wrong_query");
        }
    }

    
})

// -------------------------------------Feedback--------------------------------------



// --------------------------Payment-----------------------------

app.get("/payment",async(req,res)=>{
    q1 = "select * from payment";
    
    
    try{

            r1 =await pool.query(q1);
            const arr = []
            for(var i =0;i<r1.rows.length;i++)
            {
                arr.push(r1.rows[i]);
            }
            res.render("payment",{arr:arr});
    }catch(err)
    {
        console.log(err);
        res.json(err);
    }

});

// -------------------------------------Payment--------------------------------------


// --------------------------Customer_addr-----------------------------


app.get("/customer_addr",async(req,res)=>{
    q1 = "select customer_id, address from customer_addr";
    
    
    try{

            r1 =await pool.query(q1);
            const arr = []
            for(var i =0;i<r1.rows.length;i++)
            {
                arr.push(r1.rows[i]);
            }
            res.render("customer_addr",{arr:arr});
    }catch(err)
    {
        console.log(err);
        res.json(err);
    }

});

// -------------------------------------Customer_addr--------------------------------------


// -------------------------------------Customer--------------------------------------

app.get("/customer",(req,res)=>{
   // res.render("customer_vivek");
    res.redirect("/product");
})

app.post("/customer", async(req,res)=>{

    /*if(req.body.product_id && req.body.cancellation_id)
    {
        check_product_id = req.body.product_id;
        check_cancellation_id = req.body.cancellation_id;
        //console.log(check_product_id);
        q1 = `select product_id from cancellation where ((product_id = ${check_product_id}) and (cancellation_id = ${check_cancellation_id}))`;
        try {
            r1 = await pool.query(q1);
            if (r1.rows.length > 0) {
                check_product_id = r1.rows[0].product_id;
                console.log(check_product_id);
                console.log(check_cancellation_id);
                res.redirect("/cancellation");
            } else {
                res.render("error_for_wrong_query_admin");
            }


        } catch (err) {
            res.render("error_for_wrong_query_admin");
            //console.log(err);
        }
    }

    if (req.body.product_id && req.body.cancellation_id) {

        check_product_id = req.body.product_id;
        check_cancellation_id = req.body.cancellation_id;
        check_refund_amount = parseFloat(req.body.refund_amount);
       
        q2 = `select product_id,cancellation_id,refund_amount from cancellation where((product_id = ${check_product_id}) and (cancellation_id = ${check_cancellation_id}))`;
        try{
            r1  = await pool.query(q2);
            //check_refund_amount = req.body.refund_amount;
            //console.log(r1.rows[0].refund_amount);
            if(r1.rows[0].refund_amount>0){
                var rem = check_refund_amount;
                q3 = `update cancellation set refund_amount = ${rem} where((product_id = ${check_product_id}) and (cancellation_id = ${check_cancellation_id}))`;
                //console.log(q3);
                r = await pool.query(q3);
            }
            else
            {
                res.render("error_for_wrong_query_admin");
            }

             j = {product_id:check_product_id,cancellation_id:check_cancellation_id,refund_amount:check_refund_amount};
             JSON.stringify(j);
             check_array.push(j);
             check_array.forEach(element => {
                //console.log(element);
             });

        }catch(err)
        {
            res.render("error_for_wrong_query_admin");
        }
    }*/
    
});

// -------------------------------------Customer--------------------------------------



// ------------------------------------Shipping-------------------------------------

app.get("/shipping",async(req,res)=>{

    q1 = "select * from shipping";
    try{

        r = await pool.query(q1);
        
        const arr = []
        for (var i=0; i<r.rows.length;i++)
        {
            arr.push(r.rows[i]);
        }
        res.render("shipping",{arr:arr});
    }catch(err){
        if (err) {
            res.render("error_for_wrong_query");
        } 
    }

});

// -------------------------------------Shipping--------------------------------------




// -------------------------------------admin--------------------------------------


app.get("/admin",(req,res)=>{
    res.render("admin_shamitha");
})


app.post("/admin",async(req,res)=>{

 qu = req.body.query;
 console.log(qu);
 try{
    r = await pool.query(qu);
    const array = [];
    for(var i =0;i< r.rows.length;i++)
    {
        array.push(r.rows[i]);
    }
    res.render("query",{arr:array});
 }catch (err)
 {
    if (err) {
        res.render("error_for_wrong_query_admin");
    }
 }


})


// -------------------------------------admin--------------------------------------


// -------------------------------------cancellation--------------------------------------
let check_product_id = 0;
let check_cancellation_id = 0;
let check_refund_amount = 0;
let check_array = [];

app.get("/cancellation",async(req,res)=>{

   q1 = "select product_id, cancellation_id, refund_amount from cancellation";

   try{
        itemres = await pool.query(q1);
        const iarray = []

        for(var i =0; i< itemres.rows.length; i++)
        {
            iarray.push(itemres.rows[i]);
        }
        res.render("cancellation",{arr:iarray});
        //res.render("cancellation",{arr:iarray});

    }catch(err)
    {
        console.log(err);
    }

});



app.post("/cancellation", async(req,res)=>{

    if(req.body.product_id && req.body.cancellation_id)
    {
        check_product_id = req.body.product_id;
        check_cancellation_id = req.body.cancellation_id;
        //console.log(check_product_id);
        q1 = `select product_id from cancellation where ((product_id = ${check_product_id}) and (cancellation_id = ${check_cancellation_id}))`;
        try {
            r1 = await pool.query(q1);
            if (r1.rows.length > 0) {
                check_product_id = r1.rows[0].product_id;
                console.log(check_product_id);
                console.log(check_cancellation_id);
                res.redirect("/cancellation");
            } else {
                res.render("error_for_wrong_query_admin");
            }


        } catch (err) {
            res.render("error_for_wrong_query_admin");
            //console.log(err);
        }
    }

    if (req.body.product_id && req.body.cancellation_id) {

        check_product_id = req.body.product_id;
        check_cancellation_id = req.body.cancellation_id;
        check_refund_amount = parseFloat(req.body.refund_amount);
       
        q2 = `select product_id,cancellation_id,refund_amount from cancellation where((product_id = ${check_product_id}) and (cancellation_id = ${check_cancellation_id}))`;
        try{
            r1  = await pool.query(q2);
            //check_refund_amount = req.body.refund_amount;
            //console.log(r1.rows[0].refund_amount);
            if(r1.rows[0].refund_amount>0){
                var rem = check_refund_amount;
                q3 = `update cancellation set refund_amount = ${rem} where((product_id = ${check_product_id}) and (cancellation_id = ${check_cancellation_id}))`;
                //console.log(q3);
                r = await pool.query(q3);
            }
            else
            {
                res.render("error_for_wrong_query_admin");
            }

             j = {product_id:check_product_id,cancellation_id:check_cancellation_id,refund_amount:check_refund_amount};
             JSON.stringify(j);
             check_array.push(j);
             check_array.forEach(element => {
                //console.log(element);
             });

        }catch(err)
        {
            res.render("error_for_wrong_query_admin");
        }
    }
    
});



// -------------------------------------cancellation--------------------------------------



app.listen(3000,()=>{
    console.log("Server started at port 3000");
});