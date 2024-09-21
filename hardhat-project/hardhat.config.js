require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [
        "0xbe597d74e099c15a351adc04d06921562b7f225fad79e24fdfa29fc45cd8978b", // Curiour babies in workspace in ganache
      ],
    },
  },
};
