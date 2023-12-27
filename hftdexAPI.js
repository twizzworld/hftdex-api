const express = require('express');
const ethers = require('ethers'); // Make sure to install the ethers.js library
const app = express();
const port = process.env.PORT || 3000;

// Define environment variables or hardcode contract addresses and ABIs
const ORDERBOOK_CONTRACT_ADDRESS = process.env.ORDERBOOK_CONTRACT_ADDRESS;
const ORDERBOOK_ABI = [...]; // Replace with the actual ABI
const MARGIN_ACCOUNT_CONTRACT_ADDRESS = process.env.MARGIN_ACCOUNT_CONTRACT_ADDRESS;
const MARGIN_ACCOUNT_ABI = [...]; // Replace with the actual ABI
const LENDING_POOL_CONTRACT_ADDRESS = process.env.LENDING_POOL_CONTRACT_ADDRESS;
const LENDING_POOL_ABI = [...]; // Replace with the actual ABI

// Initialize Ethereum provider
const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_RPC_URL);

// Connect to the smart contracts
const orderBookContract = new ethers.Contract(ORDERBOOK_CONTRACT_ADDRESS, ORDERBOOK_ABI, provider);
const marginAccountContract = new ethers.Contract(MARGIN_ACCOUNT_CONTRACT_ADDRESS, MARGIN_ACCOUNT_ABI, provider);
const lendingPoolContract = new ethers.Contract(LENDING_POOL_CONTRACT_ADDRESS, LENDING_POOL_ABI, provider);

app.use(express.json());

// Place an order
app.post('/place-order', async (req, res) => {
    const { tokenA, tokenB, amount, price } = req.body;

    try {
        const signer = provider.getSigner();
        const orderBookWithSigner = orderBookContract.connect(signer);

        // Assuming the contract has a function `placeOrder`
        const tx = await orderBookWithSigner.placeOrder(tokenA, tokenB, amount, price);
        await tx.wait();

        res.json({ message: 'Order placed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Deposit to Margin Account
app.post('/deposit-margin', async (req, res) => {
    const { amount } = req.body;

    try {
        const signer = provider.getSigner();
        const marginAccountWithSigner = marginAccountContract.connect(signer);

        const tx = await marginAccountWithSigner.deposit({ value: amount });
        await tx.wait();

        res.json({ message: 'Deposit successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Withdraw from Margin Account
app.post('/withdraw-margin', async (req, res) => {
    const { amount } = req.body;

    try {
        const signer = provider.getSigner();
        const marginAccountWithSigner = marginAccountContract.connect(signer);

        const tx = await marginAccountWithSigner.withdraw(amount);
        await tx.wait();

        res.json({ message: 'Withdrawal successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Lend assets
app.post('/lend', async (req, res) => {
    const { amount } = req.body;

    try {
        const signer = provider.getSigner();
        const lendingPoolWithSigner = lendingPoolContract.connect(signer);

        const tx = await lendingPoolWithSigner.lend({ value: amount });
        await tx.wait();

        res.json({ message: 'Lending successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Borrow assets
app.post('/borrow', async (req, res) => {
    const { amount } = req.body;

    try {
        const signer = provider.getSigner();
        const lendingPoolWithSigner = lendingPoolContract.connect(signer);

        const tx = await lendingPoolWithSigner.borrow(amount);
        await tx.wait();

        res.json({ message: 'Borrowing successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
