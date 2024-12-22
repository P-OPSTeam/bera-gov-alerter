import prisma from '../utils/database.js';

const getConfig = async () => {
    return await prisma.config.findUnique({
      where: { id: 1 },
    });
};

const createConfig = async (blockId) => {
    return await prisma.config.create({
      data: {
        id: 1,
        lastBlockId: blockId,
      }
    });
};

const updateConfig = async (blockId) => {
    return await prisma.config.update({
      where: { id: 1 },
      data: {
        lastBlockId: blockId,
      }
    });
};

export default {
    getConfig,
    createConfig,
    updateConfig,
};
