const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const waveContractFactory = await hre.ethers.getContractFactory('WavePortal');
    const waveContract = await waveContractFactory.deploy();
    await waveContract.deployed()

    console.log("Contract deployed to:", waveContract.address);
    console.log("Contract deployed by:", owner.address);

    let waveTxn = await waveContract.wave("Testing :3");
    await waveTxn.wait();

    waveTxn = await waveContract.connect(randomPerson).wave("hi from a stranger!");
    await waveTxn.wait();

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
