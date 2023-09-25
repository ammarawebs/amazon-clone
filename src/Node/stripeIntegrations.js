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




  const createProductsInStripe = async (products) => {
    try {
      for (const product of products) {
        // Step 2: Create a product in Stripe
        const stripeProduct = await stripe.products.create({
          id: product.id,
          name: product.name, 
          description: product.description,
          image: [product.image]
        });
  
       
      }
      console.log('Products created in Stripe successfully');
    } catch (error) {
      console.error('Error creating products in Stripe:', error);
    }
  };





const fetchStripeProducts = async () => {
  try {
    

    // Use the `stripe` object to make API requests to fetch products
    const prices = await stripe.prices.list();
    return prices.data
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};





  module.exports = {
    createProductInStripe,
    fetchStripeProducts,
    createProductsInStripe,
  };