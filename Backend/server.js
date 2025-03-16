const express = require("express");
const connectDb = require("./Config/db");
const productRoute = require("./Routes/productRoute");
const wishlistRoute = require("./Routes/wishlistRoute");
const userRoutes = require('./Routes/userRoute'); 
const cartRoute = require("./Routes/cartRouter");
const fileuploadRoute = require('./Routes/fileUpload');
const imageFetchRoute = require('./Routes/fileFetch');
const user=require('./Routes/user');
const adminRoutes=require("./Routes/adminRoute");
const sellerRoutes=require("./Routes/sellerRouter");
const feedBackController=require("./Controller/feedBackController");

require("dotenv").config();

const cors = require("cors");
const path = require("path");
const app = express();
const port = process.env.PORT || 5000;



app.use(cors({
  origin: "http://localhost:3000", 
  methods: "GET,POST,PUT,DELETE,OPTIONS,HEAD,PATCH",
  
  allowedHeaders: "Content-Type,Authorization", 
  
  credentials: true
}));

connectDb(); 

app.use(express.json());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "An internal server error occured." });
});


app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/feedback", feedBackController);

// app.use("/api", );
app.use("/api/uploadimages", fileuploadRoute);
app.use("/api/getImages", imageFetchRoute);
app.use("/api/products", productRoute);
app.use("/api/wishlist", wishlistRoute);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoute);
app.use('/api/user',user)
// app.use('/api/',userRoutes);
// Start the server
app.listen(port, () => console.log(`Server running at ${port}`));
