import prisma from '../utils/database.js';

const BATCH_SIZE = 100;

const getAllProposals = async () => {
    return await prisma.beraProposal.findMany();
};

const createProposal = async (proposalData) => {
    return await prisma.beraProposal.create({
      data: {
        data: proposalData,
      }
    });
};

const updateProposal = async (id, updatedData) => {
    return await prisma.beraProposal.update({
      where: { id },
      data: {
        data: updatedData,
      }
    });
};

const batchInsertProposals = async (proposals) => {
    try {
        for (let i = 0; i < proposals.length; i += BATCH_SIZE) {
            const batch = proposals.slice(i, i + BATCH_SIZE);
            const batchData = batch.map((proposal) => {
                return {
                    data: proposal
                };
            })
            await prisma.beraProposal.createMany({
                data: batchData,
            });
            console.log(`Inserted batch ${i / BATCH_SIZE + 1} with ${batch.length} items`);
        }
        console.log('All batches inserted successfully');
    } catch (error) {
        console.error('Error during batch insert:', error);
        throw error;
    }
};


export default {
    getAllProposals,
    createProposal,
    updateProposal,
    batchInsertProposals,
};
