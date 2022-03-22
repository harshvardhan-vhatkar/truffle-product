import Web3 from 'web3';
import 'bootstrap/dist/css/bootstrap.css';
import configuration from '../build/contracts/Tickets.json';
import ticketImage from './images/product.png';

const createElementFromString = (string) => {
    const div = document.createElement('div');
    div.innerHTML = string.trim();
    return div.firstChild;
  };


const CONTRACT_ADDRESS = configuration.networks['5777'].address;
const CONTRACT_ABI = configuration.abi;

const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:7545');

const contract = new web3.eth.Contract(
    CONTRACT_ABI,
    CONTRACT_ADDRESS
  );

  
let account;
const accountEl = document.getElementById('account');
const ticketsEl = document.getElementById('tickets');

const TOTAL_TICKETS = 10;
const EMPTY_ADDRESS =
  '0x0000000000000000000000000000000000000000';
                                             
  const buyTicket = async (ticket) => {
    await contract.methods
      .buyTicket(ticket.id)
      .send({ from: account, value: ticket.price });
      await refreshTickets();
  };

const refreshTickets = async () => {
    ticketsEl.innerHTML = '';
    for (let i = 0; i < TOTAL_TICKETS; i++) {
      const ticket = await contract.methods.tickets(i).call();
      ticket.id = i;
      if (ticket.owner === EMPTY_ADDRESS) {
        const ticketEl = createElementFromString(
          `<div class="ticket card" style="width: 18rem;">
            <img src="${ticketImage}" class="card-img-top" alt="...">
            <div class="card-body">
              <p class="card-text">${ ticket.price / 1e18
            } ETH</p>
              <button class="btn btn-primary">Buy</button>
            </div>
          </div>`
        );
        const button = ticketEl.querySelector('button');
         button.onclick=buyTicket.bind(null, ticket);
      ticketsEl.appendChild(ticketEl);
      }
    }
  };


const main = async () => {
    const accounts = await web3.eth.requestAccounts();
    account = accounts[0];
    accountEl.innerText = account;
    await refreshTickets();
  };



main();