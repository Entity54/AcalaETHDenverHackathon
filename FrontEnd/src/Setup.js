import { ethers } from 'ethers';  
import detectEthereumProvider from '@metamask/detect-provider'; // FOR METAMASK TO BE USED This function detects most providers injected at window.ethereum

const setup = async (network = "pangolin", useMetaMask=true) => {

      let currentAccount = null;

      let provider, wallet, wss_provider=null, mm_acounts;
      //#region SETUP PROVIDER AND WALLET WITH METAMASK 
      if (useMetaMask)
      {
        const _provider = await detectEthereumProvider();

        if (_provider) {
          provider = new ethers.providers.Web3Provider(window.ethereum, "any");   
          provider.on("network", (newNetwork, oldNetwork) => {
              if (oldNetwork) {
                  window.location.reload();
              }
          });



          // /**********************************************************/
          // /* Handle chain (network) and chainChanged (per EIP-1193) */
          // /**********************************************************/
          // const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          // handleChainChanged(chainId);

          // window.ethereum.on('chainChanged', handleChainChanged);

          // function handleChainChanged(_chainId) {
          //   // We recommend reloading the page, unless you must do otherwise
          //   window.location.reload();
          // }

          /***********************************************************/
          /* Handle user accounts and accountsChanged (per EIP-1193) */
          /***********************************************************/
          // Note that this event is emitted on page load.
          // If the array of accounts is non-empty, you're already
          // connected.
          window.ethereum.on('accountsChanged', handleAccountsChanged);
          // For now, 'eth_accounts' will continue to always return an array
          function handleAccountsChanged(accounts) {
            if (accounts.length === 0) {
              // MetaMask is locked or the user has not connected any accounts
              console.log('Please connect to MetaMask.');
            } else if (accounts[0] !== currentAccount) {
              currentAccount = accounts[0];

              console.log(`******* current account: ${currentAccount}`);
              // Do any other work!

            }
          }





          mm_acounts = await _provider.request({ method: 'eth_requestAccounts' });
          console.log(`MetaMask Accounts: `,mm_acounts);
          const account = mm_acounts[0];
          const mm_chainId = await _provider.request({ method: 'eth_chainId' });
          console.log(`MetaMask mm_chainId: `,mm_chainId);
        
          wallet = provider.getSigner(); 

          return { provider, wallet, account,  };
        } 
        else { 
          console.log('Please install MetaMask!'); 
          return { provider: null, wallet: null, account: null };
        }
      }
      //#endregion SETUP PROVIDER AND WALLET WITH METAMASK  
}

export {setup};