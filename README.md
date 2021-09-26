# Assignment

## Start-up

In order to launch the application for the first time, please execute the following steps:

1. Create an `.env` file. Please use the `.env-example` as a reference to which fields are required.
2. Launch the application in docker, by executing `docker-compose up`.

## Usage

The APIs are provided below
First need to create all the products that are supported by the vending machine

#### Product Creation API
```
curl --location --request POST 'http://localhost:4703/api/v1/createProducts' \
--header 'Content-Type: application/json' \
--data-raw '{
    "products": [{
        "name": "P1",
        "amount": 10,
        "currency":"USD"
    },{
        "name": "P2",
        "amount": 100,
        "currency":"USD"
    },{
        "name": "P3",
        "amount": 10,
        "currency":"INR"
    },{
        "name": "P4",
        "amount": 10,
        "currency":"JPY"
    }]
}'
```

A vending machine will list all the products that it has to any prospective customer. Since we are not sure of where this machine is to be installed, the product prices are stored in just one currency and will be calculated on the fly for other currencies.

#### Get Product APIs

##### List all products

```
curl --location --request POST 'http://localhost:4703/api/v1/getAllProducts' \
--header 'Content-Type: application/json' \
--data-raw '{
    "currency":"INR"
}'
```
If a user likes a product they'll select it to get more info on it.
##### Get a specific product
```
curl --location --request POST 'http://localhost:4703/api/v1/selectProduct' \
--header 'Content-Type: application/json' \
--data-raw '{
    "productId":"6150239534c53e00c02106b1",
    "currency":"INR"
}'
```
Finally, the user will either choose to purchase the product or cancel their request.
If the user decides to purchase the product, the amount will be deducated and execess will be returned back.

#### Approve/Reject a Product
```
curl --location --request POST 'http://localhost:4703/api/v1/approveRejectRequest' \
--header 'Content-Type: application/json' \
--data-raw '{
    "productId":"6150239534c53e00c02106b1",
    "approve": true,
    "inputAmount": 1000,
    "inputCurrency": "INR"
}'
```

#### Tech Stack
- NodeJS
- MongoDB

#### Key Points
- Product prices in the Db have been saved WRT currency but the prices can be requested in any currency.
- The logic for rates is based on generating a random number for now, hence the product price will vary on every iteration which will not happen when using a real get rates api.
- The amount provided by the customer and it's respective change amount returned(transactional info) hasn't been logged in the DB since this kind of system will not handle multiple requests simultaneously.