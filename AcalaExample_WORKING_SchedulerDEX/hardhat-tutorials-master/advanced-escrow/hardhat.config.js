require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    mandala: {
      url: 'http://127.0.0.1:8545',
      accounts: {
        mnemonic: 'fox sight canyon orphan hotel grow hedgehog build bless august weather swarm',
        path: "m/44'/60'/0'/0",
      },
      chainId: 595,
    },
    mandalaPubDev: {
      url: 'https://tc7-eth.aca-dev.network',
      // accounts: {
      //   mnemonic: 'fox sight canyon orphan hotel grow hedgehog build bless august weather swarm',
      //   path: "m/44'/60'/0'/0",
      // },
      accounts: ["c2da717cac753da154a0b6c7c77537171e0a0fa11ad95338267658a10037b66f","c112ae37b825537ebf2b3c390bc5ffbee43a5b8fc0e1f31637991bf6a8cb85d0"],
      // accounts: ["c112ae37b825537ebf2b3c390bc5ffbee43a5b8fc0e1f31637991bf6a8cb85d0","c2da717cac753da154a0b6c7c77537171e0a0fa11ad95338267658a10037b66f"],
      chainId: 595,
      timeout: 60000,
    },
    mandalaCI: {
      url: 'http://eth-rpc-adapter-server:8545',
      accounts: {
        mnemonic: 'fox sight canyon orphan hotel grow hedgehog build bless august weather swarm',
        path: "m/44'/60'/0'/0",
      },
      chainId: 595,
    },
  }
};
