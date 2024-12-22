import { ethers } from 'ethers';
import dotenv from 'dotenv';
import beraProposalService from './services/beraProposalService.js';
import configService from './services/configService.js';
import BerachainGovernanceABI from './abi/BerachainGovernance.json' assert { type: 'json' };
import { triggerPagerDutyIncident } from './utils/pagerduty.js';
import { sendDiscordMessage } from './utils/discord.js';
import { sendTelegramMessage } from './utils/telegram.js';

dotenv.config();

const provider = new ethers.JsonRpcProvider(`${process.env.RPC}`);

const GOVERNANCE_CONTRACT_ADDRESS = process.env.GOVERNANCE_ADDRESS;

const governanceContract = new ethers.Contract(GOVERNANCE_CONTRACT_ADDRESS, BerachainGovernanceABI, provider);

const checkProposalState = async (proposalId) => {
    // Get the numerical state of the proposal
    const state = await governanceContract.state(proposalId);
    // Define an array of state names corresponding to their numerical values
    const stateNames = ['Pending', 'Active', 'Canceled', 'Defeated', 'Succeeded', 'Queued', 'Expired', 'Executed'];
    // Return both the numerical state and its corresponding name
    return { state, stateName: stateNames[state] };
}

const syncAllProposalCreatedEvents = async () => {
    try {
        const currentBlock = await provider.getBlockNumber();
        const config = await configService.getConfig();
        const startBlock = config ? Number(config.lastBlockId) : 0;
        const maxRange = 10000; // Maximum range for each query
        const shouldSendAlerts = config ? true : false; // if it is the first time getting datas, do not send alerts
        
        for (let start = startBlock; start <= currentBlock; start += maxRange) {
            const end = Math.min(start + maxRange - 1, currentBlock);
            console.log(`query proposals from block ${start} to block ${end}`)
            const filter = governanceContract.filters.ProposalCreated(null, null);

            const rangeEvents = await governanceContract.queryFilter(filter, start, end);
            if (rangeEvents.length > 0) {
                const mappedEvents = await Promise.all(rangeEvents.map(async (event) => {
                    const result = {
                        address: event.address,
                        blockHash: event.blockHash,
                        blockNumber: event.blockNumber,
                        transactionHash: event.transactionHash,
                        topics: event.topics,
                    };
                    for (const input of event.fragment.inputs) {
                        if (input.name === "proposalId") {
                            result[input.name] = event.args[input.name].toString();
                        } else {
                            if (input.name !== "values") {
                                result[input.name] = event.args[input.name];
                            }
                        }
                    }
                    // get the state
                    const proposalState = await checkProposalState(result.proposalId);
                    result.state = proposalState.state;
                    result.stateName = proposalState.stateName;
                    return result;
                }))
                await beraProposalService.batchInsertProposals(mappedEvents);
                
                // send alerts
                if (shouldSendAlerts) {
                    for (const event of mappedEvents) {
                        if (process.env.PAGERDUTY_INTEGRATION_KEY) {
                            const eventDetails = {
                                summary: "New Bera governance vote",
                                source: process.env.PAGERDUTY_SOURCE,
                                severity: "info",
                                custom_details: {
                                    description: event.description
                                },
                            };
                            await triggerPagerDutyIncident(eventDetails);
                        }
                        if (process.env.DISCORD_WEBHOOK_URL) {
                            await sendDiscordMessage(
                                `New Bera governance vote:\n${event.description}`);
                        }
                        if (process.env.TELEGRAM_BOT_TOKEN) {
                            await sendTelegramMessage(
                                `New Bera governance vote:\n${event.description}`);
                        }
                    }
                }
            }
        }
        if (config) {
            await configService.updateConfig(currentBlock);
        } else {
            await configService.createConfig(currentBlock);
        }
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
};

const updateProposalStates = async () => {
    console.log("start update Proposal states");
    const proposals = await beraProposalService.getAllProposals();
    for (const proposal of proposals) {
        const state = await checkProposalState(proposal.data.proposalId);
        if (proposal.data.state !== state.state) {
            proposal.data.state = state.state;
            proposal.data.stateName = state.stateName;
            await beraProposalService.updateProposal(proposal.id, proposal.data);
        }
    }
    console.log("end update Proposal states");
}

(async () => {
    const executeLogic = async () => {
        await syncAllProposalCreatedEvents();
        await updateProposalStates();
    };

    await executeLogic();

    // Set an interval to execute the logic every 10 minutes (600000 milliseconds)
    setInterval(async () => {
        await executeLogic();
    }, 600000);
})();
