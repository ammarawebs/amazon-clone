const stripe = require('stripe')(process.env.REACT_APP_STRIPE_SECRET_KEY);



const createProductInStripe = async (productData) => {
  try {
    const product = await stripe.products.create({
      id: productData.id, // Set the Stripe product ID to match productData.id
      name: productData.title,
      description: productData.description,
      images: [productData.image], // Provide the URL of the product image
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: productData.price * 100, // Stripe expects the price in cents
      currency: 'usd', // Change to your desired currency
      metadata: {
        product_id: productData.id, // Add product_id metadata
        price_id: `price_${productData.id}`, // Add price_id metadata (you can replace with an actual price_id if needed)
      }
    });


    return { product, price };
  } catch (error) {
    console.error("Error creating product in Stripe: ", error);
    throw error;
  }
}




  const createProductsInStripe = async (firbaseProducts) => {
    try {
      for (const product of firbaseProducts) {



      const existingStripeProducts = await stripe.products.list({ limit: 100 });

      const productExists = existingStripeProducts.data.some(
        (stripeProduct) => stripeProduct.name === product.title
      );

      if (!productExists) {
        //  Creating a product in Stripe
        const stripeProduct = await stripe.products.create({
          id: product.id,
          name: product.title, 
          description: product.description,
          images: [product.image]
        });

        const price = await stripe.prices.create({
          product: stripeProduct.id,
          unit_amount: product.price * 100, // Stripe price in cents
          currency: 'usd', 
          
        });
      }
      else{
        console.log(`Product "${product.name}" already exists in Stripe. Skipping...`);
      }
       
      }
      console.log('Products created in Stripe successfully');
    } catch (error) {
      console.error('Error creating products in Stripe:', error);
    }
  };





const fetchStripeProducts = async () => {
  try {
    

    // Use the `stripe` object to make API requests to fetch products
    const prices = await stripe.prices.list({ limit: 100 });
    return prices.data
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

const fetchStripeAllProducts = async () => {
  try {
    

    // Use the `stripe` object to make API requests to fetch products
    const products = await stripe.products.list({ limit: 100 });
    return products.data
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

const updateStripeProduct = async (stripeProductId, updatedProductData) => {
  try {
    // Fetch the product from Stripe
    const product = await stripe.products.update(stripeProductId, {
      name: updatedProductData.title ,
      description: updatedProductData.description,
      images: [updatedProductData.image]
    });

    const prices = await stripe.prices.list({ product: stripeProductId });

    console.log('PRICE',updatedProductData.price)

    // Loop through the prices and updating them
    for (const price of prices.data) {
  
      await stripe.prices.update(price.id, {
        active: false,
      });

      
      console.log("Price updated in Stripe:", price);
    }

     await stripe.prices.create({
        product:stripeProductId,
        unit_amount: updatedProductData.price * 100,
        currency: 'usd',
      });

    
  } catch (error) {
    console.error("Error updating product in Stripe:", error);
    throw error; // Rethrow the error to handle it in your error handling code.
  }
};





export {
  createProductInStripe,
  fetchStripeProducts,
  createProductsInStripe,
  fetchStripeAllProducts,
  updateStripeProduct,
};