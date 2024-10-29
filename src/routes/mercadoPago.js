const { render } = require("ejs");

const mp = new MercadoPago('TEST-a34bb4f8-e2b0-447c-8a72-e31ffa215c17',{
    locale: "es-MX",
});

document.getElementById("chekout-btn").addEventListener("click", async () =>{
    try {
    const orderData = {
        title : "producto",
        quanty : 1,
        price: 100,
    }

    const response = await fetch("http://localhost:3000/create_preference",{
        method: "POST",
        headers:{
            "Content-Type": "aplication/json",
        },
        body: JSON.stringify(orderData),
    });
    const preference = await response.json()
    createCheckoutButton(preference.id);
    } catch(error){
        alert("error:(")
    }
    
});

const createCheckoutButton = (preferenceId) => {
    const bricksBuilder = mp.bricks();
    const renderComponent = async () =>{
        if (window.CheckoutButton) window.CheckoutButton.unmount();

       await bricksBuilder.create("wallet", "wallet_container", {
            initialization: {
                preferenceId: preferenceId,
            },
         customization: {
          texts: {
           valueProp: 'smart_option',
          },
          },
         });
    }
    renderComponent()
}
