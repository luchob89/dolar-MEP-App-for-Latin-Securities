# Dollar MEP Buy/Sell Application for Latin Securities

[![es](https://img.shields.io/badge/lang-es-yellow.svg)](https://github.com/luchob89/dolar-MEP-App-for-Latin-Securities/blob/main/README.es.md)

## General Description

This Dollar MEP buy/sell application is a simulation of a financial tool designed to facilitate the purchase and sale of USD using ARS through the AL30 bond. The application allows users to calculate transaction costs, execute buy/sell operations, manage their balances, and view their transaction history. \
\
It is an application built with the Next.js framework of React, which includes Redux as a state management library. I always choose Next.js whenever possible for several reasons. I already have previous experience with this framework, and I like features such as the file structure, optimizations for images and fonts, and performance improvements applied for client/server rendering and data fetching. I believe it is a framework that greatly considers the developer's perspective, and its documentation has always seemed very user-friendly to me. \
\
I used Redux, on one hand, to manage the high-level states of the application (e.g. ARS and USD user balances) and, on the other hand, as a kind of client-side database to save the transaction log and thus generate the Transaction History. Implementing a database (relational or not) seemed like it would significantly delay the development time without necessarily improving the product's functionality. Considering that the application's objective is to present it as a technical test, I solved the minimal persistent information it needs in this way. This would not be the case if the application were intended to work in a context of real, non-simulated balances.

## Link for direct access (production deployment on Vercel server)

https://dolar-mep-app-for-latin-securities.vercel.app/

## Features

- **Buy USD**: Calculate and execute the purchase of USD using ARS.
- **Sell USD**: Calculate and execute the sale of USD to obtain ARS.
- **Transaction History**: View a history of all buy and sell transactions.
- **Balance Management**: Track and update balances in ARS and USD.

## Components

### `App`

The main entry point of the application. Sets up the Redux provider and renders the `ChooseAmounts`, `MainCard`, `BuyCard`, and `Sellcard` components.

### `ChooseAmounts`

Allows users to enter initial balance amounts in ARS and USD to perform an accurate simulation of values close to the client's reality, or to continue using the application's default balances if the client decides to test its functionality without filling in the initial fields. These fields include input validation and error handling for balances less than or equal to 0. Additionally, if one or more transactions have been made, this screen includes a button to clear the Transaction History.

### `MainCard`

The main component that provides the interface for buying and selling USD. Displays initial balances in ARS and USD, along with buttons to choose the action, accompanied by the current buy/sell rate. When one or more transactions have been made, this component includes the Transaction History table below the main component.

### `BuyCard`

Provides the interface for entering the ARS amount to be used to buy USD. Includes input validation with error handling for balances less than or equal to 0 and a "Buy all my available balance" button to automatically calculate how many bonds can be purchased with the current ARS balance.

### `SellCard`

Provides the interface for entering the USD amount to be sold to obtain ARS. Includes input validation with error handling for balances less than or equal to 0 and a "Sell all my available balance" button to automatically calculate how many bonds can be sold with the current USD balance.

### `BuyCalculationResult`

Handles the calculation and display of results for buy transactions. Shows the amount to buy, the current purchase rate, the bond name, the number of bonds to buy, the amount to credit in ARS, and the final purchase amount in USD. It also manages the confirmation and success modals for buy operations.

### `SellCalculationResult`

Handles the calculation and display of results for sell transactions. Shows the amount to sell, the current sale rate, the bond name, the number of bonds to sell, the amount to debit in USD, and the final sale amount in ARS. It also manages the confirmation and success modals for sell operations.

### `TxsHistoryTable`

Displays a table with all past transactions, including different details for desktop and mobile devices. For the former, it shows the date, transaction type, pre-balance (in ARS for purchases, in USD for sales), purchased/sold amount, post-balance (in ARS for purchases, in USD for sales), and the exchange rate used for the transaction. For mobile devices, the data is limited to the date, purchased/sold amount, and the exchange rate used. This table can be cleared on the previous `ChooseAmounts` screen in case previous records need to be "reset" for a new balance selection.

## State Management

The application uses Redux for state management. The main state slice is `userDataSlice`, which includes actions to change balances, switch modes (which, in turn, changes the screen rendered for the client), and add transaction records.

## Testing

The application includes unit tests for all main components using Jest and React Testing Library. This first version of the tests covers only correct rendering, input changes, error handling, and basic action dispatching.

## Installation

To install and run the application locally, follow these steps:

1. Clone the repository:
    
	```
	git clone https://github.com/luchob89/dolar-MEP-App-for-Latin-Securities
	```
	
2. Navigate to the project directory:

    ```
	cd dolar-MEP-App-for-Latin-Securities
	```
	
3. Install dependencies:
    
	```
	npm install
	```
	
4. Build and start a production version:
    
	```
	npm start
	```
	
## Usage

1. Open the application in your browser.
2. Enter an ARS balance to use for buying USD and a USD balance to use for obtaining ARS. You can also continue with the application's default balances.
3. Click the "Buy USD" button to buy USD or the "Sell USD" button to sell USD.
4. Confirm the transaction in the modal that appears.
5. View the updated balances and transaction history.

