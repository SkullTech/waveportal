const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
    const waveContract = await waveContractFactory.deploy({
        value: hre.ethers.utils.parseEther('0.1')
    });
    await waveContract.deployed()

    console.log("Contract deployed to:", waveContract.address);
    console.log("Contract deployed by:", owner.address);
    let contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log("Contract balance:", hre.ethers.utils.formatEther(contractBalance));
    let randomPersonBalance = await hre.ethers.provider.getBalance(randomPerson.address);
    console.log("Balance of random person:", hre.ethers.utils.formatEther(randomPersonBalance))

    let waveTxn = await waveContract.connect(randomPerson).wave("hi from a stranger!");
    await waveTxn.wait();
    waveTxn = await waveContract.connect(randomPerson).wave("another hi");
    await waveTxn.wait();

    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log("Contract balance:", hre.ethers.utils.formatEther(contractBalance));

    randomPersonBalance = await hre.ethers.provider.getBalance(randomPerson.address);
    console.log("Balance of random person:", hre.ethers.utils.formatEther(randomPersonBalance))

    let allWaves = await waveContract.getWaves();
    console.log(allWaves);
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

runMain();
